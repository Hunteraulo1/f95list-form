<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';
import { navigate } from 'svelte-routing';
import type { ChangeEventHandler, FormEventHandler } from 'svelte/elements';

import AddTraductorModal from '$components/AddTraductorModal.svelte';
import LoadingSpinner from '$components/LoadingSpinner.svelte';
import Modal from '$components/Modal.svelte';
import Search from '$components/Search.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, queryGame, traductors, userIsSuperAdmin } from '$lib/stores';
import type { GameType } from '$types/schemas';
import { DocumentDuplicate, Icon, Link, LinkSlash, UserPlus } from 'svelte-hero-icons';

const dispatch = createEventDispatcher();

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

    dispatch('newToast', {
      id: Date.now(),
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

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'warning',
      message: 'Impossible de récupérer les informations du jeu',
      milliseconds: 3000,
    });
  }
});

interface InsertObject {
  id: string;
  domain: string;
  name: string;
  version: string;
  status: string;
  tags: string;
  type: string;
  ac: boolean;
  link: string;
  image: string;
}

const changeStep = async (amount: number) => {
  if (step + amount >= 0 && step + amount <= 5) step += amount;
  if (step === 1 && game.domain === 'Autre') step += amount; // ID
  if (step === 2 && game.domain === 'F95z') step += amount; // Game informations
  if (step === 4 && game.domain === 'Autre') step += amount; // Auto-Check

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

    game.name = name ?? game.name;
    game.tversion = game.tversion === '' ? version : game.tversion;
    game.status = status ?? game.status;
    game.tags = tags ?? game.tags;
    game.type = type ?? game.type;
    game.image = image ?? game.image;
  } catch (error) {
    console.error('Error scrapped game', error);
    dispatch('newToast', {
      id: Date.now(),
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

  // @ts-expect-error - We know that key is a valid key of GameType
  game[key] = value;

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

  if (edit) {
    const query = $queryGame;

    try {
      const result = await GAS_API.putGame({ game, query, silentMode });

      if (result === 'duplicate') {
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'warning',
          message: 'Le jeu existe déjà dans la liste',
          milliseconds: 3000,
        });

        return;
      }

      navigate('/');
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: 'Le jeu a bien été modifié',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Error fetching game', error);

      dispatch('newToast', {
        id: Date.now(),
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
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'warning',
          message: 'Le jeu existe déjà dans la liste',
          milliseconds: 3000,
        });

        return;
      }

      navigate('/');
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: 'Le jeu a bien été ajouté',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Error adding game', error);

      dispatch('newToast', {
        id: Date.now(),
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

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'warning',
      message: 'Veuillez entrer une raison pour supprimer le jeu',
      milliseconds: 3000,
    });

    return null;
  }
  const query = $queryGame;
  const { name, version } = query;

  $isLoading = true;

  try {
    const query = { name, version };

    await GAS_API.delGame({ query, comment, silentMode });

    navigate('/');
    dispatch('newToast', {
      id: Date.now(),
      alertType: 'success',
      message: 'Le jeu a bien été supprimé',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Error deleting game', error);

    dispatch('newToast', {
      id: Date.now(),
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

    dispatch('newToast', {
      id: Date.now(),
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
        <div class:hidden={step !== 0 && step !== 5}>
          <label for="domain">Platforme:</label>
          <select
            placeholder="Platforme du jeu"
            class="select select-bordered w-full"
            name="domain"
            value={game.domain}
            onchange={handleChange}
            required
          >
            <option>F95z</option>
            <option>LewdCorner</option>
            <option>Autre</option>
          </select>
        </div>

        <div class:hidden={step !== 1 && step !== 5}>
          <label for="id">ID:</label>
          <input
            type="number"
            placeholder="Id du jeu"
            class="number-input input input-bordered w-full appearance-none"
            pattern="[0-9]*"
            inputmode="numeric"
            name="id"
            onchange={handleChange}
            bind:value={game.id}
          />
        </div>

        <div class:hidden={step !== 2 && step !== 5}>
          <label for="name">Nom:</label>
          <input
            type="text"
            placeholder="Nom du jeu"
            class="input input-bordered w-full"
            class:input-error={!edit && game.domain !== "F95z"}
            name="name"
            onchange={handleChange}
            oninput={handleInput}
            oninvalid={handleInvalid}
            required
            bind:value={game.name}
          />
        </div>

        <div class:hidden={step !== 2 && step !== 5}>
          <label for="link">Lien du jeu:</label>
          <div class="flex gap-1">
            <input
              type="text"
              placeholder="Lien du jeu"
              class="input input-bordered w-full"
              class:input-error={!edit && game.domain !== "F95z"}
              name="link"
              onchange={handleChange}
              oninput={handleInput}
              required
              value={game.link}
            />
            <a
              href={game.link}
              target="_blank"
              class="btn w-min"
              class:btn-disable={!game.link}
              class:btn-primary={game.link}
              onclick={(e) => !game.link}
            >
              <Icon src={game.link ? Link : LinkSlash} size="1rem" />
            </a>
          </div>
        </div>

        <div class:hidden={step !== 2 && step !== 5}>
          <label for="status">Status:</label>
          <select
            placeholder="Status du jeu"
            class="select select-bordered w-full"
            name="status"
            onchange={handleChange}
            value={game.status}
            required
          >
            <option>EN COURS</option>
            <option>TERMINÉ</option>
            <option>ABANDONNÉ</option>
          </select>
        </div>

        <div class:hidden={step !== 2 && step !== 5}>
          <label for="tags">Tags:</label>
          <textarea
            id="tags"
            name="tags"
            placeholder="Tags du jeu"
            class="textarea textarea-bordered textarea-xs max-h-32 w-full"
            onchange={handleChange}
            value={game.tags}
          ></textarea>
        </div>

        <div class:hidden={step !== 2 && step !== 5}>
          <label for="type">Type:</label>
          <select
            placeholder="Type du jeu"
            class="select select-bordered w-full"
            name="type"
            onchange={handleChange}
            value={game.type}
            required
          >
            <option>RenPy</option>
            <option>RPGM</option>
            <option>Unity</option>
            <option>Unreal</option>
            <option>Flash</option>
            <option>HTLM</option>
            <option>QSP</option>
            <option>Autre</option>
            <option>RenPy/RPGM</option>
            <option>RenPy/Unity</option>
          </select>
        </div>

        <div class:hidden={step !== 2 && step !== 5} class="imgHint relative">
          <label for="image">Lien de l'image:</label>
          <input
            type="text"
            placeholder="Lien de l'image"
            class="input input-bordered w-full"
            class:input-error={!edit && game.domain !== "F95z"}
            name="image"
            onchange={handleChange}
            oninput={handleInput}
            onfocusin={(e) =>
              e.currentTarget.nextElementSibling?.classList.remove("hidden")}
            onfocusout={(e) =>
              e.currentTarget.nextElementSibling?.classList.add("hidden")}
            required
            value={game.image}
          />

          <img
            src={game.image}
            alt="bannière du jeu 2"
            class="absolute mt-1 hidden w-full max-w-md rounded-md"
            loading="lazy"
            onerror={handleImageError}
          />
        </div>

        <div class:hidden={step !== 2 && step !== 5}>
          <label for="version">Version actuelle:</label>
          <input
            type="text"
            placeholder="Version du jeu"
            class="input input-bordered w-full"
            class:input-error={!edit && game.domain !== "F95z"}
            name="version"
            onchange={handleChange}
            oninput={handleInput}
            required
            value={game.version}
          />
        </div>

        <div class:hidden={step !== 3 && step !== 5}>
          <label for="tversion">Version de la traduction:</label>
          <div class="flex gap-1">
            <input
              type="text"
              placeholder="Version de la traduction"
              class="input input-bordered w-full"
              class:input-error={!edit}
              name="tversion"
              onchange={handleChange}
              oninput={(e) => handleInput(e)}
              required
              value={game.tversion}
            />
            <button
              class="btn w-min"
              class:btn-disable={!game.version}
              class:btn-primary={game.version}
              onclick={() => {
                if (game.version) game.tversion = game.version;
              }}
            >
              <Icon src={DocumentDuplicate} size="1rem" />
            </button>
          </div>
        </div>

        <div class:hidden={step !== 3 && step !== 5}>
          <label for="tname">Status de la traduction:</label>
          <select
            placeholder="Status de la traduction"
            class="select select-bordered w-full"
            name="tname"
            onchange={handleChange}
            value={game.tname}
            required
          >
            <option>Traduction</option>
            <option>Traduction (mod inclus)</option>
            <option>Intégrée</option>
            <option>Pas de traduction</option>
          </select>
        </div>

        <div class:hidden={step !== 3 && step !== 5}>
          <label for="tlink">Lien de la traduction:</label>
          <div class="flex gap-1">
            <input
              type="text"
              placeholder="Lien de la traduction"
              class="input input-bordered w-full"
              name="tlink"
              onchange={handleChange}
              value={game.tlink}
            />
            <a
              href={game.tlink}
              target="_blank"
              class="btn w-min"
              class:btn-disable={!game.tlink}
              class:btn-primary={game.tlink}
              onclick={(e) => !game.tlink}
            >
              <Icon src={game.tlink ? Link : LinkSlash} size="1rem" />
            </a>
          </div>
        </div>

        <div class:hidden={step !== 3 && step !== 5}>
          <label for="traductor">Traducteur:</label>
          <div class="flex gap-1">
            <input
              placeholder="Nom du traducteur"
              type="search"
              id="traductor"
              name="traductor"
              class="input input-bordered w-full"
              list="traductor-list"
              oninput={handleChange}
              value={game.traductor}
            />
            <datalist id="traductor-list">
              {#each $traductors as traductor}
                <option>{traductor.name}</option>
              {/each}
            </datalist>
            <button
              class="btn btn-primary w-min"
              onclick={() => {
                traductorModal[0] = true;
              }}
            >
              <Icon src={UserPlus} size="1rem" />
            </button>
          </div>
        </div>

        <div class:hidden={step !== 3 && step !== 5}>
          <label for="proofreader">Relecteur:</label>
          <div class="flex gap-1">
            <input
              placeholder="Nom du relecteur"
              type="search"
              id="proofreader"
              name="proofreader"
              class="input input-bordered w-full"
              list="proofreader-list"
              oninput={handleChange}
              value={game.proofreader}
            />
            <datalist id="proofreader-list">
              {#each $traductors as traductor}
                <option>{traductor.name}</option>
              {/each}
            </datalist>
            <button
              class="btn btn-primary w-min"
              onclick={() => {
                traductorModal[1] = true;
              }}
            >
              <Icon src={UserPlus} size="1rem" />
            </button>
          </div>
        </div>

        <div class:hidden={step !== 3 && step !== 5}>
          <label for="ttype">Type de Traduction:</label>
          <select
            placeholder="Type de la traduction"
            class="select select-bordered w-full"
            name="ttype"
            onchange={handleChange}
            value={game.ttype}
            required
          >
            <option>Traduction Humaine</option>
            <option>Traduction Automatique</option>
            <option>Traduction Semi-Automatique</option>
            <option>VO Française</option>
            <option>À tester</option>
          </select>
        </div>

        <div class="flex items-end" class:hidden={step !== 4 && step !== 5}>
          <div
            class="flex h-12 w-full flex-col items-center justify-center gap-2"
          >
            <label for="ac">Voulez-vous activer l'Auto-Check ?</label>
            <input
              type="checkbox"
              name="ac"
              class="checkbox checkbox-lg"
              onchange={handleChange}
              checked={game.ac}
            />
          </div>
        </div>
      </div>
      <div class="flex w-full flex-col justify-center gap-4 px-8 sm:flex-row">
        {#if step < 5}
          <button
            class="btn btn-outline btn-primary w-full sm:w-48"
            type="button"
            onclick={() => changeStep(-1)}
            disabled={step <= 0}
          >
            Précédent
          </button>
          <button
            class="btn btn-primary w-full sm:w-48"
            type="button"
            onclick={() => changeStep(1)}
          >
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
              }}
            >
              Supprimer le jeu
            </button>
          {/if}
        {/if}
        {#if !edit && $userIsSuperAdmin}
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
            }}
          >
            Dev data
          </button>
        {/if}
        {#if $userIsSuperAdmin && game.domain === "F95z"}
          <button
            class="btn btn-info w-full sm:w-48"
            type="button"
            onclick={() => scrapeData({ id: game.id, domain: "F95z" })}
          >
            Force scrape
          </button>
        {/if}
        {#if game.domain === "LewdCorner"}
          <button
            class="btn btn-info w-full sm:w-48"
            type="button"
            onclick={() => {
              insertModal = true;
            }}
          >
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
  on:newToast
/>
<AddTraductorModal
  bind:showModal={traductorModal[1]}
  name={game.proofreader}
  on:newToast
/>
