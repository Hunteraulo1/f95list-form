<script lang="ts">
  import Modal from '$components/Modal.svelte'
  import Search from '$components/Search.svelte'
  import { GAS_API } from '$lib/GAS_API'
  import { isLoading, queryGame, userIsSuperAdmin } from '$lib/stores'
  import type { GameType, TraductorType } from '$types/schemas'
  import { createEventDispatcher, onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import type { ChangeEventHandler, FormEventHandler } from 'svelte/elements'

  const dispatch = createEventDispatcher()

  export let step: number = 0
  export let edit: boolean = false
  export let game: GameType = {
    status: 'EN COURS',
    type: 'RenPy',
    tname: 'Traduction',
    ttype: 'Traduction Humaine',
    ac: false,
    domain: 'F95z',
    id: '',
    link: '',
    name: '',
    reader: '',
    tags: '',
    tlink: '',
    traductor: '',
    tversion: '',
    version: '',
    trlink: '',
    image: ''
  }

  let savedId = ''
  let traductors: TraductorType[] = []
  let dialog: HTMLDialogElement

  onMount(async () => {
    try {
      const result = await GAS_API.getTraductors()

      if (!Array.isArray(result)) {
        throw new Error('getTraductor no result')
      }

      traductors = result
    } catch (error) {
      console.error('Error deleting game', error)

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: 'Impossible de récupérer la liste des traducteurs',
        milliseconds: 3000
      })
    }
  })

  const changeStep = async (amount: number) => {
    if (step + amount >= 0 && step + amount <= 5) step += amount
    if (step === 1 && game.domain === 'Autre') step += amount // ID
    if (step === 2 && game.domain === 'F95z') step += amount // Game informations
    if (step === 4 && game.domain === 'Autre') step += amount // Auto-Check

    const gameId = parseInt(game.id ?? '0')

    if (step === 3 && game.domain === 'F95z' && gameId && savedId !== game.id) {
      const { id, domain } = game

      savedId = id!

      try {
        const result = await GAS_API.getScrape({ id, domain })

        console.info({ result })

        const { name, version, status, tags, type } = result

        game.name = name
        game.version = version
        game.status = status
        game.tags = tags
        game.type = type
      } catch (error) {
        console.error('Error scrapped game', error)
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: 'Impossible de récupérer les informations du jeu',
          milliseconds: 3000
        })
      }
    }
  }

  const handleChange: ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  > = event => {
    const { name, value } = event.currentTarget
    const key = name as keyof Omit<GameType, 'trlink' | 'ac'>

    const { domain, id } = game

    if (name === 'ac' && event.currentTarget instanceof HTMLInputElement) {
      game['ac'] = event.currentTarget.checked

      return
    }

    // @ts-ignore
    game[key] = value

    if ((name === 'platform' || name === 'id') && id && id !== '0') {
      switch (domain) {
        case 'F95z':
          game.link = `https://f95zone.to/threads/${id}`
          break
        case 'LewdCorner':
          game.link = `https://lewdcorner.com/threads/${id}`
          break
      }
    }
  }

  const handleInput: FormEventHandler<HTMLInputElement> = event => {
    const { value, classList } = event.currentTarget
    value === ''
      ? classList.add('input-error')
      : classList.remove('input-error')
  }

  const handleSubmit = async () => {
    $isLoading = true

    if (edit) {
      const query = $queryGame

      try {
        await GAS_API.putGame({ game, query })

        navigate('/')
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'success',
          message: 'Le jeu a bien été modifié',
          milliseconds: 3000
        })
      } catch (error) {
        console.error('Error fetching game', error)

        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: 'Impossible de modifier le jeu',
          milliseconds: 3000
        })
      } finally {
        $isLoading = false
      }
    } else {
      try {
        const result = await GAS_API.postGame({ game })

        if (result === 'duplicate') {
          dispatch('newToast', {
            id: Date.now(),
            alertType: 'error',
            message: 'Le jeu existe déjà dans la liste',
            milliseconds: 3000
          })

          return
        }

        navigate('/')
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'success',
          message: 'Le jeu a bien été ajouté',
          milliseconds: 3000
        })
      } catch (error) {
        console.error('Error adding game', error)

        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: "Impossible d'ajouter le jeu",
          milliseconds: 3000
        })
      } finally {
        $isLoading = false
      }
    }
  }

  const handleInvalid: FormEventHandler<HTMLInputElement> = event => {
    event.currentTarget.setCustomValidity('Veuillez remplir ce champ')
  }

  let comment = ''

  const handleClickDelete = async () => {
    if (!comment) {
      console.log('no comment')

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'warning',
        message: 'Impossible de supprimer le jeu',
        milliseconds: 3000
      })

      return null
    }
    const query = $queryGame
    const { name, version } = query

    $isLoading = true

    try {
      await GAS_API.delGame({ name, version, comment })

      navigate('/')
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: 'Le jeu a bien été supprimé',
        milliseconds: 3000
      })
    } catch (error) {
      console.error('Error deleting game', error)

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: 'Impossible de supprimer le jeu',
        milliseconds: 3000
      })
    } finally {
      $isLoading = false
    }
  }
</script>

{#if !$isLoading}
  <div class="mt-0 flex flex-col items-center justify-center gap-4">
    <Search {edit} />
    <form
      class="relative flex w-full flex-col items-center"
      on:submit|preventDefault={handleSubmit}
      autocomplete="off"
    >
      <div
        class="grid w-full grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {#if step === 0 || step === 5}
          <div>
            <label for="domain">Platforme:</label>
            <select
              placeholder="Platforme du jeu"
              class="select select-bordered w-full"
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
              class="number-input input input-bordered w-full appearance-none"
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
              class={`input input-bordered w-full ${edit ? '' : 'input-error'}`}
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
              class={`input input-bordered w-full ${edit ? '' : 'input-error'}`}
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
              class="select select-bordered w-full"
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
              class="textarea textarea-bordered textarea-xs max-h-32 w-full"
              on:change={handleChange}
              value={game.tags}
            ></textarea>
          </div>

          <div>
            <label for="type">Type:</label>
            <select
              placeholder="Type du jeu"
              class="select select-bordered w-full"
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
              class={`input input-bordered w-full ${edit ? '' : 'input-error'}`}
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
              class={`input input-bordered w-full ${edit ? '' : 'input-error'}`}
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
              class="select select-bordered w-full"
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
              class="input input-bordered w-full"
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
              name="traductor"
              class="input input-bordered w-full"
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
              name="reader"
              class="input input-bordered w-full"
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
              class="select select-bordered w-full"
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
              class="flex h-12 w-full flex-col items-center justify-center gap-2"
            >
              <label for="ac">Voulez-vous activer l'Auto-Check ?</label>
              <input
                type="checkbox"
                name="ac"
                class="checkbox checkbox-lg"
                on:change={handleChange}
                checked={game.ac}
              />
            </div>
          </div>
        {/if}
      </div>
      <div class="flex w-full flex-col justify-center gap-4 px-8 sm:flex-row">
        {#if step < 5}
          <button
            class="btn btn-outline btn-primary w-full sm:w-48"
            type="button"
            on:click={() => changeStep(-1)}
            disabled={step <= 0}
          >
            Précédent
          </button>
          <button
            class="btn btn-primary w-full sm:w-48"
            type="button"
            on:click={() => changeStep(1)}
          >
            Suivant
          </button>
        {:else}
          <button class="btn btn-primary w-full sm:w-48" type="submit">
            {edit ? 'Éditer le jeu' : 'Ajouter le jeu'}
          </button>
          {#if edit}
            <button
              class="btn btn-error w-full sm:w-48"
              type="button"
              on:click={() => dialog.showModal()}
            >
              Supprimer le jeu
            </button>
          {/if}
        {/if}
        {#if !edit && $userIsSuperAdmin}
          <button
            class="btn btn-info w-full sm:w-48"
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
                ac: false,
                image: ''
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
      bind:value={comment}
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
