<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import Modal from '../components/Modal.svelte'
  import Search from '../components/Search.svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { isLoading, queryGame, userIsSuperAdmin } from '../stores'
  import type { TraductorType } from '../types/schemas'
  import type { Game } from '../types/types'
  const dispatch = createEventDispatcher()

  export let step: number = 0 // TODO: default step value: 0
  export let edit: boolean = false
  export let game: Game = {
    domain: 'F95z',
    id: '',
    name: '',
    link: '',
    status: 'EN COURS',
    tags: '',
    type: 'RenPy',
    version: '',
    tversion: '',
    tname: 'Traduction',
    tlink: '',
    traductor: '',
    reader: '',
    ttype: 'Traduction Humaine',
    ac: false
  }

  let savedId: string | null = null
  let traductors: TraductorType[] = []
  let dialog: HTMLDialogElement

  onMount(() => {
    GAS_API.getTraductors()
      .then((result: TraductorType[] | unknown) => {
        if (Array.isArray(result)) {
          traductors = result
        } else {
          console.error('Error: Type of unexpected result from translators')
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'error',
            message:
              'Erreur lors de la récupération de la liste des traducteurs',
            milliseconds: 3000
          })
        }
      })
      .catch(err => {
        console.error('Error deleting game', err)
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: 'Impossible de récupérer la liste des traducteurs',
          milliseconds: 3000
        })
      })
      .finally(() => {
        isLoading.set(false)
      })
  })

  const changeStep = (n: number) => {
    if (step + n >= 0 && step + n <= 5) {
      step += n
    }

    if (
      (step === 1 && game.domain === 'Autre') ||
      (step === 4 && game.domain === 'Autre') ||
      (step === 2 && (game.domain === 'F95z' || game.domain === 'LewdCorner'))
    ) {
      step += n
    }

    if (
      step === 3 &&
      (game.domain === 'F95z' || game.domain === 'LewdCorner') &&
      (savedId === null || savedId !== game.id) &&
      game.id &&
      game.id !== '0'
    ) {
      const { id, domain } = game

      savedId = id

      GAS_API.getScrape({ id: id, domain })
        .then(result => {
          if (result) {
            const { name, version, status, tags, type } = result as any

            game.name = name
            game.version = version
            game.status = status
            game.tags = tags
            game.type = type
          }
        })
        .catch(err => {
          console.error('Error scraped game', err)
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'error',
            message: 'Impossible de récupérer les informations du jeu',
            milliseconds: 3000
          })
        })
    }
  }

  const handleChange = (
    event: Event & {
      currentTarget: EventTarget &
        (HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement)
    }
  ) => {
    const { name, value } = event.currentTarget
    ;(game as any)[name] = value

    const { domain, id } = game
    if ((name === 'platform' || name === 'id') && id && id !== '0') {
      switch (domain) {
        case 'F95z':
          game.link = `https://f95zone.to/threads/${id}`
          break
        case 'LewdCorner':
          game.link = `https://lewdcorner.com/threads/${id}`
      }
    }
  }

  const handleInput = (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    const { value, classList } = event.currentTarget
    value === ''
      ? classList.add('input-error')
      : classList.remove('input-error')
  }

  const handleSubmit = () => {
    isLoading.set(true)

    if (edit) {
      const query = $queryGame

      GAS_API.putGame({ game, query })
        .then((result: string | unknown) => {
          navigate('/')
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'success',
            message: 'Le jeu à bien été modifié',
            milliseconds: 3000
          })
        })
        .catch(err => {
          console.error('Error fetching game', err)
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'error',
            message: 'Impossible de modifier le jeu',
            milliseconds: 3000
          })
        })
        .finally(() => {
          isLoading.set(false)
        })
    } else {
      GAS_API.postGame(game)
        .then((result: string | unknown) => {
          console.log(result)
          //navigate('/')
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'success',
            message: 'Le jeu à bien été ajouté',
            milliseconds: 3000
          })
        })
        .catch(err => {
          console.error('Error adding game', err)
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'error',
            message: "Impossible d'ajouter le jeu",
            milliseconds: 3000
          })
        })
        .finally(() => {
          isLoading.set(false)
        })
    }
  }

  const handleInvalid = (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    event.currentTarget.setCustomValidity('Veuillez remplir ce champ')
  }

  // @ts-ignore
  const deleteGameModal = () => delete_game_modal.showModal()
  let deleteMessage = ''
  const handleClickDelete = () => {
    if (deleteMessage !== '') {
      const query = $queryGame
      const comment = deleteMessage

      const { name, version } = query
      GAS_API.delGame({ name, version, comment })
        .then((result: string | unknown) => {
          console.log(result)
          navigate('/')
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'success',
            message: 'Le jeu à bien été supprimé',
            milliseconds: 3000
          })
        })
        .catch(err => {
          console.error('Error deleting game', err)
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'error',
            message: 'Impossible de supprimer le jeu',
            milliseconds: 3000
          })
        })
        .finally(() => {
          isLoading.set(false)
        })
    }
  }
</script>

{#if !$isLoading}
  <div class="flex flex-col items-center justify-center gap-4 mt-0">
    <Search {edit} />
    <form
      class="relative flex flex-col items-center w-full"
      on:submit|preventDefault={handleSubmit}
    >
      <div
        class="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full"
      >
        {#if step === 0 || step === 5}
          <div>
            <label for="domain">Platforme:</label>
            <select
              placeholder="Platforme du jeu"
              class="w-full select-bordered select"
              name="domain"
              value={game.domain}
              on:change={handleChange}
              required
            >
              <option>F95z</option>
              <option>LewdCorner</option>
              <option>Autre</option>
            </select>
          </div>
        {/if}
        {#if step === 1 || step === 5}
          <div>
            <label for="id">ID:</label>
            <input
              type="number"
              placeholder="Id du jeu"
              class="w-full appearance-none input input-bordered number-input"
              pattern="[0-9]*"
              inputmode="numeric"
              name="id"
              on:change={handleChange}
              value={game.id}
            />
          </div>
        {/if}
        {#if step === 2 || step === 5}
          <div>
            <label for="name">Nom:</label>
            <input
              type="text"
              placeholder="Nom du jeu"
              class={`w-full input input-bordered ${edit ? '' : 'input-error'}`}
              name="name"
              on:change={handleChange}
              on:input={e => handleInput(e)}
              on:invalid={handleInvalid}
              required
              value={game.name}
            />
          </div>

          <div>
            <label for="link">Lien:</label>
            <input
              type="text"
              placeholder="Lien du jeu"
              class={`w-full input input-bordered ${edit ? '' : 'input-error'}`}
              name="link"
              on:change={handleChange}
              on:input={e => handleInput(e)}
              required
              value={game.link}
            />
          </div>

          <div>
            <label for="status">Status:</label>
            <select
              placeholder="Status du jeu"
              class="w-full select-bordered select"
              name="status"
              on:change={handleChange}
              value={game.status}
              required
            >
              <option>EN COURS</option>
              <option>TERMINÉ</option>
              <option>ABANDONNÉ</option>
            </select>
          </div>

          <div>
            <label for="tags">Tags:</label>
            <textarea
              id="tags"
              name="tags"
              placeholder="Tags du jeu"
              class="w-full textarea textarea-bordered textarea-xs max-h-32"
              on:change={handleChange}
              value={game.tags}
            ></textarea>
          </div>

          <div>
            <label for="type">Type:</label>
            <select
              placeholder="Type du jeu"
              class="w-full select-bordered select"
              name="type"
              on:change={handleChange}
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

          <div>
            <label for="version">Version actuelle:</label>
            <input
              type="text"
              placeholder="Version du jeu"
              class={`w-full input input-bordered ${edit ? '' : 'input-error'}`}
              name="version"
              on:change={handleChange}
              on:input={e => handleInput(e)}
              required
              value={game.version}
            />
          </div>
        {/if}
        {#if step === 3 || step === 5}
          <div>
            <label for="tversion">Version de la traduction:</label>
            <input
              type="text"
              placeholder="Version de la traduction"
              class={`w-full input input-bordered ${edit ? '' : 'input-error'}`}
              name="tversion"
              on:change={handleChange}
              on:input={e => handleInput(e)}
              required
              value={game.tversion}
            />
          </div>

          <div>
            <label for="tname">Status de la traduction:</label>
            <select
              placeholder="Status de la traduction"
              class="w-full select-bordered select"
              name="tname"
              on:change={handleChange}
              value={game.tname}
              required
            >
              <option>Traduction</option>
              <option>Traduction (mod inclus)</option>
              <option>Intégrée</option>
              <option>Pas de traduction</option>
            </select>
          </div>

          <div>
            <label for="tlink">Lien de la traduction:</label>
            <input
              type="text"
              placeholder="Lien de la traduction"
              class="w-full input input-bordered"
              name="tlink"
              on:change={handleChange}
              value={game.tlink}
            />
          </div>

          <div>
            <label for="traductor">Traducteur:</label>
            <input
              placeholder="Nom du traducteur"
              type="search"
              id="traductor"
              class="w-full input input-bordered"
              list="traductor-list"
              on:change={handleChange}
              value={game.traductor}
            />
            <datalist id="traductor-list">
              {#each traductors as traductor}
                <option>{traductor.name}</option>
              {/each}
            </datalist>
          </div>

          <div>
            <label for="reader">Relecteur:</label>
            <input
              placeholder="Nom du relecteur"
              type="search"
              id="reader"
              class="w-full input input-bordered"
              list="reader-list"
              on:change={handleChange}
              value={game.reader}
            />
            <datalist id="reader-list">
              {#each traductors as traductor}
                <option>{traductor.name}</option>
              {/each}
            </datalist>
          </div>

          <div>
            <label for="ttype">Type de Traduction:</label>
            <select
              placeholder="Type de la traduction"
              class="w-full select-bordered select"
              name="ttype"
              on:change={handleChange}
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
        {/if}
        {#if step === 4 || step === 5}
          <div class="flex items-end">
            <div
              class="flex flex-col items-center justify-center w-full h-12 gap-2"
            >
              <label for="ac">Voulez-vous activer l'Auto-Check ?</label>
              <input
                type="checkbox"
                class="checkbox checkbox-lg"
                on:change={handleChange}
                value={game.ac}
              />
            </div>
          </div>
        {/if}
      </div>
      <div class="flex justify-center px-8 w-full gap-4 flex-col sm:flex-row">
        {#if step < 5}
          <button
            class="sm:w-48 w-full btn btn-outline btn-primary"
            type="button"
            on:click={() => changeStep(-1)}
            disabled={step <= 0}
          >
            Précédent
          </button>
          <button
            class="sm:w-48 w-full btn btn-primary"
            type="button"
            on:click={() => changeStep(1)}
          >
            Suivant
          </button>
        {:else}
          <button class="sm:w-48 w-full btn btn-primary" type="submit">
            {edit ? 'Éditer le jeu' : 'Ajouter le jeu'}
          </button>
          {#if edit}
            <!-- svelte-ignore missing-declaration -->
            <button
              class="sm:w-48 w-full btn btn-error"
              type="button"
              on:click={() => dialog.showModal()}
            >
              Supprimer le jeu
            </button>
          {/if}
        {/if}
        {#if !edit && $userIsSuperAdmin}
          <button
            class="sm:w-48 w-full btn btn-info"
            type="button"
            on:click={() => {
              step = 5
              game = {
                domain: 'Autre',
                id: '666',
                name: 'TEST GAME FOR DEV',
                link: 'https://testgame.dev',
                status: 'ABANDONNÉ',
                tags: 'TEST, DEV, NE PAS TOUCHER',
                type: 'Autre',
                version: 'v666',
                tversion: 'n/a',
                tname: 'Pas de traduction',
                tlink: 'https://traduction.dev',
                traductor: 'Hunteraulo',
                reader: 'Hunteraulo',
                ttype: 'À tester',
                ac: false
              }
            }}
          >
            Dev button
          </button>
        {/if}
      </div>
    </form>
  </div>
{/if}

<Modal bind:dialog title="Supprimer le jeu">
  <div slot="modal-content">
    <p class="py-4">Êtes-vous sûr de vouloir supprimer ce jeu ?</p>
    <textarea
      placeholder="Pourquoi voulez-vous supprimer le jeu ?"
      class="textarea textarea-bordered max-h-32 w-full"
      bind:value={deleteMessage}
    ></textarea>
  </div>
  <button
    slot="modal-action"
    on:click={handleClickDelete}
    class="btn btn-error"
  >
    Supprimer définitivement
  </button>
</Modal>
