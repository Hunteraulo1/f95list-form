<script lang="ts">
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';
import type { ChangeEventHandler, FormEventHandler } from 'svelte/elements';

import AddTraductorModal from '$components/AddTraductorModal.svelte';
import LoadingSpinner from '$components/LoadingSpinner.svelte';
import Modal from '$components/Modal.svelte';
import Search from '$components/Search.svelte';
import { GAS_API } from '$lib/GAS_API';
import checkUser from '$lib/checkUser';
import { isLoading, newToast, queryGame, traductors } from '$lib/stores';
import { Game, type GameType } from '$types/schemas';
import { DocumentDuplicate, Icon, Link, LinkSlash } from 'svelte-hero-icons';
import FormGameDatalist from './FormGameDatalist.svelte';
import FormGameInput from './FormGameInput.svelte';
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
let deleteModal = $state(false);
let insertModal = $state(false);
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
  if (step === 4 && game.domain === 'Autre' && checkUser(['admin'])) {
    step += amount; // Auto-Check
  }
  if (step === 4 && !checkUser(['admin'])) step += amount; // Auto-Check

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

const handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (event) => {
  const { name, value } = event.currentTarget;
  const key = name as keyof Omit<GameType, 'trlink' | 'ac'>;

  const { domain, id } = game;

  if (name === 'ac' && event.currentTarget instanceof HTMLInputElement) {
    game.ac = event.currentTarget.checked;

    return;
  }

  if (name === 'tname' && value === 'Intégrée') {
    game.tversion = 'Intégrée';

    return;
  }

  (game[key] as string) = value;

  if ((name === 'domain' || name === 'id') && id && id !== '0') {
    switch (domain) {
      case 'F95z':
        game.link = `https://f95zone.to/threads/${id}`;
        break;
      case 'LewdCorner':
        game.link = `https://lewdcorner.com/threads/${id}`;
    }
  }
};

const handleInput: FormEventHandler<HTMLInputElement> = (event) => {
  const { value, classList } = event.currentTarget;

  value === '' ? classList.add('input-error') : classList.remove('input-error');
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

const handleInvalid: FormEventHandler<HTMLInputElement> = (event) => {
  event.currentTarget.setCustomValidity('Veuillez remplir ce champ');
};

let comment = $state('');
let insertObject: string = $state('');

const handleClickDelete = async () => {
  if (!comment) {
    console.log('no comment');

    newToast({
      id: Date.now().toString(),
      alertType: 'warning',
      message: 'Veuillez entrer une raison pour supprimer le jeu',
      milliseconds: 3000,
    });

    return null;
  }
  $isLoading = true;

  if (checkUser(['traductor'])) {
    try {
      await GAS_API.postSubmit({ game, type: 'delete', comment });

      navigate('/');
      newToast({
        id: Date.now().toString(),
        alertType: 'success',
        message: 'La suppression du jeu a bien été soumise',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Error fetching game', error);

      newToast({
        id: Date.now().toString(),
        alertType: 'error',
        message: 'Impossible de soumettre la suppression du jeu',
        milliseconds: 3000,
      });
    }

    return;
  }

  const { name, version } = $queryGame;
  try {
    const query = { name, version };

    await GAS_API.delGame({ query, comment, silentMode });

    navigate('/');
    newToast({
      id: Date.now().toString(),
      alertType: 'success',
      message: 'Le jeu a bien été supprimé',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Error deleting game', error);

    newToast({
      id: Date.now().toString(),
      alertType: 'error',
      message: 'Impossible de supprimer le jeu',
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};

const handleClickInsert = () => {
  if (!insertObject) {
    console.log('no object');

    newToast({
      id: Date.now().toString(),
      alertType: 'warning',
      message: 'Veuillez entrer les données de LC Extractor',
      milliseconds: 3000,
    });

    return null;
  }

  Object.assign(game, JSON.parse(insertObject));

  game.ac = false; // Reload view data
};

const handleImageError = (e: Event) => {
  const target = e.currentTarget as HTMLImageElement;

  if (game.image.startsWith('https://attachments.f95zone.to/')) {
    target.src = game.image.replace('attachments', 'preview');
  } else {
    target.classList.add('hidden');
  }
};
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

        <FormGameInput 
          value={game.image}
          {game}
          active={[6, 5]}
          {step}
          className="imgHint relative"
          title="Lien de l'image"
          name="image"
          type="text"
          oninput={handleInput}
          onfocusin={(e) =>
            e.currentTarget.nextElementSibling?.classList.remove("hidden")}
          onfocusout={(e) =>
            e.currentTarget.nextElementSibling?.classList.add("hidden")}
          required>
          <img
            src={game.image}
            alt="bannière du jeu 2"
            class="absolute top-20 hidden w-full max-w-md rounded-md"
            loading="lazy"
            onerror={handleImageError}
          />
        </FormGameInput>

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
          <FormGameInput value={game.ac} {game} checked={game.ac} active={[14, 5]} {step} title="Auto-Check" name="ac" type="checkbox" />
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
            <button
              class="btn btn-error w-full sm:w-48"
              type="button"
              onclick={() => {
                deleteModal = true;
              }}>
              Supprimer le jeu
            </button>
          {/if}
        {/if}
        {#if !edit && checkUser(['superAdmin'])}
          <button
            class="btn btn-info w-full sm:w-48"
            type="button"
            onclick={() => {
              step = 5;
              game = {
                domain: "Autre",
                id: "666",
                name: "TEST GAME FOR DEV",
                link: "https://testgame.dev",
                status: "ABANDONNÉ",
                tags: "TEST, DEV, NE PAS TOUCHER",
                type: "Autre",
                version: "v666",
                tversion: "n/a",
                tname: "Pas de traduction",
                tlink: "https://traduction.dev",
                traductor: "Hunteraulo",
                proofreader: "Hunteraulo",
                ttype: "À tester",
                ac: false,
                image:
                  "https://attachments.f95zone.to/2024/04/3572650_Remaster_HD.png",
              };
            }}>
            Dev data
          </button>
          {#if game.domain === "F95z"}
            <button
              class="btn btn-info w-full sm:w-48"
              type="button"
              onclick={() => scrapeData({ id: game.id, domain: "F95z" })}>
              Force scrape
            </button>
          {/if}
        {/if}
        {#if game.domain === "LewdCorner"}
          <button
            class="btn btn-info w-full sm:w-48"
            type="button"
            onclick={() => { insertModal = true }}>
            Insert Data
          </button>
        {/if}
      </div>
    </form>
  </div>
{/if}

<Modal bind:showModal={deleteModal} title="Supprimer le jeu">
  <div slot="modalContent">
    <p class="py-4">Êtes-vous sûr de vouloir supprimer ce jeu ?</p>
    <textarea
      placeholder="Pourquoi voulez-vous supprimer le jeu ?"
      class="textarea textarea-bordered max-h-32 w-full"
      bind:value={comment}
    ></textarea>
  </div>
  <button
    slot="modalAction"
    onclick={handleClickDelete}
    class="btn btn-error"
  >
    Supprimer définitivement
  </button>
</Modal>

<Modal bind:showModal={insertModal} title="Insérer les données du jeu">
  <div slot="modalContent">
    <p class="py-4">Veuillez coller les données de LC Extractor ?</p>
    <textarea
      placeholder="Données de LC Extractor"
      class="textarea textarea-bordered max-h-32 w-full"
      bind:value={insertObject}
    ></textarea>
  </div>
  <button slot="modalAction" onclick={handleClickInsert} class="btn btn-info">
    Envoyer
  </button>
</Modal>

<AddTraductorModal
  bind:showModal={traductorModal[0]}
  name={game.traductor}
/>
<AddTraductorModal
  bind:showModal={traductorModal[1]}
  name={game.proofreader}
/>
