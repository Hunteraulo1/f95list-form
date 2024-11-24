<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, queryGame, traductors } from '$lib/stores';
import { checkUser } from '$lib/utils';
import { Game, type GameType } from '$types/schemas';
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';
import LoadingSpinner from './LoadingSpinner.svelte';
import Search from './Search.svelte';
import Checkbox from './formGame/Checkbox.svelte';
import Datalist from './formGame/Datalist.svelte';
import Dev from './formGame/Dev.svelte';
import Input from './formGame/Input.svelte';
import InputImage from './formGame/InputImage.svelte';
import Insert from './formGame/Insert.svelte';
import Remove from './formGame/Remove.svelte';
import Select from './formGame/Select.svelte';
import Textarea from './formGame/Textarea.svelte';

interface Props {
  step?: number;
  edit?: boolean;
  game?: GameType;
  handleUpdateSubmit?: (type: 'validated' | 'rejected') => void;
  editor?: boolean;
  deleteMode?: boolean;
}

let {
  step = $bindable(0),
  edit = false,
  game = $bindable({
    status: 'EN COURS',
    type: 'RenPy',
    tname: 'Traduction',
    ttype: 'Traduction Humaine',
    ac: false,
    domain: 'F95z',
    id: null,
    link: '',
    name: '',
    proofreader: '',
    tags: '',
    tlink: '',
    traductor: '',
    tversion: '',
    version: '',
    trlink: '',
    image: '',
  } as GameType),
  handleUpdateSubmit,
  editor = $bindable(),
  deleteMode = false,
}: Props = $props();

let savedId: number | undefined;
let silentMode = $state(false);
let scraping = $state(false);

onMount(async () => {
  $isLoading = true;

  try {
    let dataTraductors = await GAS_API.getTraductors();

    if (!Array.isArray(dataTraductors)) {
      throw new Error('getTraductor no result');
    }

    $traductors = dataTraductors;
    console.log('traductors data:', dataTraductors);
  } catch (error) {
    console.error('getTradutor no return: ', error);

    newToast({
      alertType: 'error',
      message: 'Impossible de récupérer la liste des traducteurs',
    });
  } finally {
    $isLoading = false;
  }

  const { id, domain, ac } = game;

  if (step !== 5 || domain !== 'F95z' || !ac) return;

  try {
    await scrapeData({ id, domain });
  } catch (error) {
    console.error('scrapeData no return: ', error);

    newToast({
      alertType: 'warning',
      message: 'Impossible de récupérer les informations du jeu',
    });
  }
});

const changeStep = async (amount: number) => {
  if (step + amount >= 0 && step + amount <= 5) step += amount;
  if (step === 1 && game.domain === 'Autre') step += amount; // ID
  if (step === 2 && game.domain === 'F95z') step += amount; // Game informations
  if (
    (step === 4 && game.domain === 'Autre' && checkUser(['admin', 'superAdmin'])) ||
    (step === 4 && !checkUser(['admin', 'superAdmin']))
  ) {
    step += amount; // Auto-Check
  }

  const gameId = game.id;

  if (step === 3 && game.domain === 'F95z' && game.id && gameId && savedId !== game.id) {
    const { id, domain } = game;

    savedId = game.id;

    await scrapeData({ id, domain });
  }
};

interface ScrapeDataArgs {
  id: GameType['id'];
  domain: Extract<GameType['domain'], 'F95z'>;
}

const scrapeData = async ({ id, domain }: ScrapeDataArgs) => {
  try {
    scraping = true;
    const result = await GAS_API.getScrape({ id, domain });

    console.info({ result });

    const { name, version, status, tags, type, image } = result;

    if (game.ac === true || !edit) {
      game.version = version ?? game.version;
    }

    game = {
      ...game,
      name: name ?? game.name,
      tversion: game.tversion === '' ? version : game.tversion,
      status: status ?? game.status,
      tags: tags ?? game.tags,
      type: type ?? game.type,
      image: image ?? game.image,
    };
  } catch (error) {
    console.error('Error scrapped game', error);
    newToast({
      alertType: 'error',
      message: 'Impossible de récupérer les informations du jeu',
    });
  } finally {
    scraping = false;
  }
};

const handleSubmit = async () => {
  $isLoading = true;

  if (checkUser(['traductor'])) {
    if (edit && !$queryGame) throw new Error('Query not found');

    try {
      const result = await GAS_API.postSubmit({
        query: edit ? $queryGame : undefined,
        game,
        type: edit ? 'edit' : 'add',
        comment: '',
      });

      navigate('/');

      if (result === 'duplicate') {
        newToast({
          alertType: 'warning',
          message: 'Une soumission existe déjà pour cette traduction',
        });

        return;
      }

      newToast({
        alertType: 'success',
        message: 'La traduction a bien été soumise',
      });
    } catch (error) {
      console.error('Error fetching game', error);

      newToast({
        alertType: 'error',
        message: 'Impossible de soumettre la traduction',
      });
    } finally {
      $isLoading = false;
      $queryGame = undefined;
    }

    return;
  }

  if (edit) {
    try {
      if (!$queryGame) throw new Error('Query not found');

      const result = await GAS_API.putGame({ game, query: $queryGame, silentMode });

      if (result === 'duplicate') {
        newToast({
          alertType: 'warning',
          message: 'Le jeu existe déjà dans la liste',
        });

        return;
      }

      navigate('/');
      newToast({
        alertType: 'success',
        message: 'Le jeu a bien été modifié',
      });

      handleUpdateSubmit?.('validated');
    } catch (error) {
      console.error('Error fetching game', error);

      newToast({
        alertType: 'error',
        message: 'Impossible de modifier le jeu',
      });
    } finally {
      $isLoading = false;
      $queryGame = undefined;
    }
  } else {
    try {
      const result = await GAS_API.postGame({ game, silentMode });

      if (result === 'duplicate') {
        newToast({
          alertType: 'warning',
          message: 'Le jeu existe déjà dans la liste',
        });

        return;
      }

      navigate('/');
      newToast({
        alertType: 'success',
        message: 'Le jeu a bien été ajouté',
      });
    } catch (error) {
      console.error('Error adding game', error);

      newToast({
        alertType: 'error',
        message: "Impossible d'ajouter le jeu",
      });
    } finally {
      $isLoading = false;
    }

    handleUpdateSubmit?.('validated');
  }
};

type Element = {
  Component: typeof Select | typeof Input | typeof Textarea | typeof Datalist | typeof InputImage | typeof Checkbox;
  type?: HTMLInputElement['type'];
  values?: any[];
  title: string;
  className?: string;
  active?: number[];
  checked?: boolean;
  name: keyof GameType;
};

const elements: Element[] = [
  {
    Component: Select,
    active: [0, 5],
    title: 'Platforme',
    name: 'domain',
    values: Game.shape.domain.options,
  },
  {
    Component: Input,
    active: [1, 5],
    title: 'ID du jeu',
    name: 'id',
    type: 'number',
  },
  {
    Component: Input,
    active: [2, 5],
    title: 'Nom du jeu',
    name: 'name',
    type: 'text',
  },
  {
    Component: Input,
    active: [2, 5],
    title: 'Lien du jeu',
    name: 'link',
    type: 'text',
  },
  {
    Component: Select,
    active: [2, 5],
    title: 'Status du jeu',
    name: 'status',
    values: Game.shape.status.options,
  },
  {
    Component: Textarea,
    active: [2, 5],
    title: 'Tags du jeu',
    name: 'tags',
  },
  {
    Component: Select,
    active: [2, 5],
    title: 'Type du jeu',
    name: 'type',
    values: Game.shape.type.options,
  },
  {
    Component: InputImage,
    active: [2, 5],
    title: "Lien de l'image du jeu",
    name: 'image',
  },
  {
    Component: Input,
    active: [2, 5],
    title: 'Version du jeu',
    name: 'version',
    type: 'text',
  },
  {
    Component: Input,
    active: [3, 5],
    title: 'Version de la traduction',
    name: 'tversion',
    type: 'text',
  },
  {
    Component: Select,
    active: [3, 5],
    title: 'Status de la traduction',
    name: 'tname',
    values: Game.shape.tname.options,
  },
  {
    Component: Input,
    active: [3, 5],
    title: 'Lien de la traduction',
    name: 'tlink',
    type: 'text',
  },
  {
    Component: Datalist,
    active: [3, 5],
    title: 'Traducteur',
    name: 'traductor',
  },
  {
    Component: Datalist,
    active: [3, 5],
    title: 'Relecteur',
    name: 'proofreader',
  },
  {
    Component: Select,
    active: [3, 5],
    title: 'Type de Traduction',
    name: 'ttype',
    values: Game.shape.ttype.options,
  },
  {
    Component: Checkbox,
    active: [4, 5],
    title: 'Auto-Check',
    name: 'ac',
    checked: game.ac,
  },
];
</script>

{#if !$isLoading}
  <div class="mt-0 flex flex-col items-center justify-center gap-4 w-full">
    {#if !handleUpdateSubmit}
      <Search {edit} />
    {/if}
    <form
      class="relative flex w-full flex-col items-center"
      onsubmit={handleSubmit}
      autocomplete="off"
    >
      {#if scraping}
        <div class="lg:absolute flex items-center gap-1 left-0">
          <LoadingSpinner />
          Chargement des données en cours
        </div>
      {/if}
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text pr-2">Mode silencieux</span>
          <input
            type="checkbox"
            class="toggle"
            checked={silentMode}
            onchange={() => {silentMode = !silentMode}}
          />
        </label>
      </div>
      <div
        class="grid w-full grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {#if !deleteMode && $traductors.length > 0}
          {#each elements as { Component, name, title, active, className, checked, values, type }}
            <Component {game} {step} {name} {title} {active} {className} {checked} {values} {type} />
          {/each}
        {/if}
      </div>
      <div class="flex w-full flex-col justify-center gap-4 px-8 sm:flex-row">
        {#if !deleteMode}
          {#if step < 5}
            <button
              class="btn btn-outline btn-primary w-full sm:w-48"
              type="button"
              onclick={() => changeStep(-1)}
              disabled={step <= 0}>
              Précédent
            </button>
            <button
              class="btn btn-primary w-full sm:w-48"
              type="button"
              onclick={() => changeStep(1)}>
              Suivant
            </button>
          {:else}
            <button class="btn btn-primary w-full sm:w-48" type="submit">
              {edit ? "Éditer le jeu" : "Ajouter le jeu"}
            </button>
          {/if}
        {/if}
        {#if (edit && !editor) || (editor && deleteMode)}
          <Remove {game} {silentMode} {handleUpdateSubmit} {editor} />
        {/if}
        {#if !edit && checkUser(['superAdmin', 'superAdmin'])}
          <Dev {game} {step} {scrapeData} />
        {/if}
        {#if game.domain === "LewdCorner"}
          <Insert {game} />
        {/if}
        {#if editor}
          <button class="btn btn-primary w-full sm:w-48" type="button" onclick={()=> {editor = false}}>
            Annuler
          </button>
        {/if}
      </div>
    </form>
  </div>
{/if}
