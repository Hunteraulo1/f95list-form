<script lang="ts">
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';

import AddTraductorModal from '$components/AddTraductorModal.svelte';
import LoadingSpinner from '$components/LoadingSpinner.svelte';
import Search from '$components/Search.svelte';
import { GAS_API } from '$lib/GAS_API';
import checkUser from '$lib/checkUser';
import { isLoading, newToast, queryGame, traductors } from '$lib/stores';
import { Game, type GameType } from '$types/schemas';
import { DocumentDuplicate, Icon, Link, LinkSlash } from 'svelte-hero-icons';
import FormGameDatalist from './FormGameDatalist.svelte';
import FormGameDev from './FormGameDev.svelte';
import FormGameInput from './FormGameInput.svelte';
import FormGameInputImage from './FormGameInputImage.svelte';
import FormGameInsert from './FormGameInsert.svelte';
import FormGameRemove from './FormGameRemove.svelte';
import FormGameSelect from './FormGameSelect.svelte';
import FormGameTextarea from './FormGameTextarea.svelte';

interface Props {
  step?: number;
  edit?: boolean;
  game?: GameType;
  isAdmin: boolean;
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
let traductorModal = $state([false, false]);
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

let comment = $state('');
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
            onchange={() => (silentMode = !silentMode)}
          />
        </label>
      </div>
      <div
        class="grid w-full grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >

        <FormGameSelect value={game.domain} {game} active={[0, 5]} {step} title="Platforme" name="domain" values={Game.shape.domain.options} />
      
        <FormGameInput value={game.id} {game} active={[1, 5]} {step} title="ID du jeu" name="id" type="number" pattern="[0-9]" inputmode="numeric" />

        <FormGameInput value={game.name} {game} active={[2, 5]} {step} title="Nom du jeu" name="name" type="text" />

        <FormGameInput value={game.link} {game} active={[3, 5]} {step} title="Lien du jeu" name="link" type="text">
          <a
            href={game.link}
            target="_blank"
            class="btn w-min"
            class:btn-disable={!game.link}
            class:btn-primary={game.link}>
            <Icon src={game.link ? Link : LinkSlash} size="1rem" />
          </a>
        </FormGameInput>

        <FormGameSelect value={game.status} {game} active={[4, 5]} {step} title="Status du jeu" name="status" values={Game.shape.status.options} />

        <FormGameTextarea value={game.tags} {game} name="tags" active={[2,5]} {step} title="Tags du jeu" />

        <FormGameSelect value={game.type} {game} active={[5]} {step} title="Type du jeu" name="type" values={Game.shape.type.options} />

        <FormGameInputImage {game} {step} />

        <FormGameInput value={game.version} {game} active={[7, 5]} {step} title="Version du jeu" name="version" type="text" />

        <FormGameInput value={game.tversion} {game} active={[8, 5]} {step} title="Version de la traduction" name="tversion" type="text">
          <button
            class="btn w-min"
            class:btn-disable={!game.version}
            class:btn-primary={game.version}
            onclick={(e) => {
              e.preventDefault();
              if (game.version) game.tversion = game.version;
            }}>
            <Icon src={DocumentDuplicate} size="1rem" />
          </button>
        </FormGameInput>

        <FormGameSelect value={game.tname} {game} active={[9, 5]} {step} title="Status de la traduction" name="tname" values={Game.shape.tname.options} />

        <FormGameInput value={game.tlink} {game} active={[10, 5]} {step} title="Lien de la traduction" name="tlink" type="text">
          <a
            href={game.tlink}
            target="_blank"
            class="btn w-min"
            class:btn-disable={!game.tlink}
            class:btn-primary={game.tlink}>
            <Icon src={game.tlink ? Link : LinkSlash} size="1rem" />
          </a>
        </FormGameInput>

        <FormGameDatalist value={game.traductor} {game} active={[11, 5]} {step} title="Traducteur" name="traductor" values={$traductors} modal={traductorModal[0]} />

        <FormGameDatalist value={game.proofreader} {game} active={[12, 5]} {step} title="Relecteur" name="proofreader" values={$traductors} modal={traductorModal[1]} />

        <FormGameSelect value={game.ttype} {game} active={[13, 5]} {step} title="Type de Traduction" name="ttype" values={Game.shape.ttype.options} />

        {#if checkUser(['admin'])}
          <FormGameInput value={game.ac} {game} checked={game.ac} active={[14, 5]} {step} title="Auto-Check" name="ac" type="checkbox" className="flex h-full w-full flex-col justify-center" />
        {/if}
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
            <FormGameRemove {game} silentMode={silentMode} comment={comment} />
          {/if}
        {/if}
        {#if !edit && checkUser(['superAdmin'])}
          <FormGameDev {game} {step} {scrapeData} />
        {/if}
        {#if game.domain === "LewdCorner"}
          <FormGameInsert {game} />
        {/if}
      </div>
    </form>
  </div>
{/if}

<AddTraductorModal
  bind:showModal={traductorModal[0]}
  name={game.traductor}
/>
<AddTraductorModal
  bind:showModal={traductorModal[1]}
  name={game.proofreader}
/>
