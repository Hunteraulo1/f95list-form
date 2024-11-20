<script lang="ts">
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';

import { GAS_API } from '$lib/GAS_API';
import checkUser from '$lib/checkUser';
import { isLoading, newToast, queryGame, traductors } from '$lib/stores';
import { Game, type GameType } from '$types/schemas';
import LoadingSpinner from './LoadingSpinner.svelte';
import Search from './Search.svelte';
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
    id: '',
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
  }),
}: Props = $props();

let savedId = '';
let silentMode = $state(false);
let scraping = $state(false);

onMount(async () => {
  try {
    let dataTraductors = await GAS_API.getTraductors();

    if (!Array.isArray(dataTraductors)) {
      throw new Error('getTraductor no result');
    }

    $traductors = dataTraductors;
  } catch (error) {
    console.error('getTradutor no return: ', error);

    newToast({
      id: Date.now().toString(),
      alertType: 'error',
      message: 'Impossible de récupérer la liste des traducteurs',
      milliseconds: 3000,
    });
  }

  const { id, domain, ac } = game;

  if (step !== 5 || domain !== 'F95z' || !ac) return;

  try {
    await scrapeData({ id, domain });
  } catch (error) {
    console.error('scrapeData no return: ', error);

    newToast({
      id: Date.now().toString(),
      alertType: 'warning',
      message: 'Impossible de récupérer les informations du jeu',
      milliseconds: 3000,
    });
  }
});

const changeStep = async (amount: number) => {
  if (step + amount >= 0 && step + amount <= 5) step += amount;
  if (step === 1 && game.domain === 'Autre') step += amount; // ID
  if (step === 2 && game.domain === 'F95z') step += amount; // Game informations
  if ((step === 4 && game.domain === 'Autre' && checkUser(['admin'])) || (step === 4 && !checkUser(['admin']))) {
    step += amount; // Auto-Check
  }

  const gameId = Number.parseInt(game.id);

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
      id: Date.now().toString(),
      alertType: 'error',
      message: 'Impossible de récupérer les informations du jeu',
      milliseconds: 3000,
    });
  } finally {
    scraping = false;
  }
};

const handleSubmit = async () => {
  $isLoading = true;

  if (checkUser(['traductor'])) {
    try {
      await GAS_API.postSubmit({
        game,
        type: edit ? 'edit' : 'add',
        comment: '',
      });

      navigate('/');
      newToast({
        id: Date.now().toString(),
        alertType: 'success',
        message: 'Le jeu a bien été soumis',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Error fetching game', error);

      newToast({
        id: Date.now().toString(),
        alertType: 'error',
        message: 'Impossible de soumettre le jeu',
        milliseconds: 3000,
      });
    }

    return;
  }

  if (edit) {
    const query = $queryGame;

    try {
      const result = await GAS_API.putGame({ game, query, silentMode });

      if (result === 'duplicate') {
        newToast({
          id: Date.now().toString(),
          alertType: 'warning',
          message: 'Le jeu existe déjà dans la liste',
          milliseconds: 3000,
        });

        return;
      }

      navigate('/');
      newToast({
        id: Date.now().toString(),
        alertType: 'success',
        message: 'Le jeu a bien été modifié',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Error fetching game', error);

      newToast({
        id: Date.now().toString(),
        alertType: 'error',
        message: 'Impossible de modifier le jeu',
        milliseconds: 3000,
      });
    } finally {
      $isLoading = false;
    }
  } else {
    try {
      const result = await GAS_API.postGame({ game, silentMode });

      if (result === 'duplicate') {
        newToast({
          id: Date.now().toString(),
          alertType: 'warning',
          message: 'Le jeu existe déjà dans la liste',
          milliseconds: 3000,
        });

        return;
      }

      navigate('/');
      newToast({
        id: Date.now().toString(),
        alertType: 'success',
        message: 'Le jeu a bien été ajouté',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Error adding game', error);

      newToast({
        id: Date.now().toString(),
        alertType: 'error',
        message: "Impossible d'ajouter le jeu",
        milliseconds: 3000,
      });
    } finally {
      $isLoading = false;
    }
  }
};

type Element = Partial<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> & {
  Component: typeof Select | typeof Input | typeof Textarea | typeof Datalist | typeof InputImage;
  value?: GameType[keyof GameType];
  values?: any[];
  title: string;
  className?: string;
  active?: number[];
  name: keyof GameType;
};

const elements: Element[] = [
  {
    Component: Select,
    value: game.domain,
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
    pattern: '[0-9]',
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
    value: game.status,
    active: [2, 5],
    title: 'Status du jeu',
    name: 'status',
    values: Game.shape.status.options,
  },
  {
    Component: Textarea,
    value: game.tags,
    active: [2, 5],
    title: 'Tags du jeu',
    name: 'tags',
  },
  {
    Component: Select,
    value: game.type,
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
    className: 'imgHint relative',
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
    value: game.tname,
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
    value: game.traductor,
    active: [3, 5],
    title: 'Traducteur',
    name: 'traductor',
    values: $traductors,
  },
  {
    Component: Datalist,
    value: game.proofreader,
    active: [3, 5],
    title: 'Relecteur',
    name: 'proofreader',
    values: $traductors,
  },
  {
    Component: Select,
    value: game.ttype,
    active: [3, 5],
    title: 'Type de Traduction',
    name: 'ttype',
    values: Game.shape.ttype.options,
  },
  {
    Component: Input,
    checked: game.ac,
    active: [4, 5],
    title: 'Auto-Check',
    name: 'ac',
    type: 'checkbox',
    className: 'flex h-full w-full flex-col justify-center',
  },
];
</script>

{#if !$isLoading}
  <div class="mt-0 flex flex-col items-center justify-center gap-4">
    <Search {edit} />
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
        {#each elements as {Component, value, active, title, name, values}}
          <Component {value} {game} {active} {step} {title} {name} {values} />
        {/each}
      </div>
      <div class="flex w-full flex-col justify-center gap-4 px-8 sm:flex-row">
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
          {#if edit}
            <Remove {game} silentMode={silentMode} />
          {/if}
        {/if}
        {#if !edit && checkUser(['superAdmin'])}
          <Dev {game} {step} {scrapeData} />
        {/if}
        {#if game.domain === "LewdCorner"}
          <Insert {game} />
        {/if}
      </div>
    </form>
  </div>
{/if}
