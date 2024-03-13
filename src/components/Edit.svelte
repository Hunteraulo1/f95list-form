<script>
  import { onMount } from 'svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { isLoading } from '../stores'
  import Modal from './Modal.svelte'

  onMount(() => {
    //fetchGame()
    fetchTest()
  })

  let games

  /**
   * Fetches the user from the server.
   */
  async function fetchGame() {
    isLoading.set(true)

    console.log('fetching game...')

    GAS_API.getGames()
      .then(result => {
        games = result
        console.log('Games:', result)
      })
      .catch(err => {
        console.error('Could not get games:', err)
      })
      .finally(() => {
        console.log('Games loaded.')
        isLoading.set(false)
      })
  }

  async function fetchTest() {
    isLoading.set(true)

    console.log('fetching test...')

    GAS_API.getTest()
      .then(result => {
        console.log('Test:', result)
      })
      .catch(err => {
        console.error('Could not get test:', err)
      })
      .finally(() => {
        console.log('Test loaded.')
        isLoading.set(false)
      })
  }
</script>

<!-- TODO: à supprimer -->
<div class="relative flex flex-col items-center">
  <div
    class="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  >
    <div>
      <label for="domain">Platforme:</label>
      <select
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full select-bordered select"
        name="domain"
        list="domain-list"
        required
      >
        <option>F95z</option>
        <option>LewdCorner</option>
        <option>Autre</option>
      </select>
    </div>

    <div>
      <label for="id">ID:</label>
      <input
        type="number"
        placeholder="Rechercher un jeu"
        class="w-full appearance-none input input-bordered number-input"
        pattern="[0-9]*"
        inputmode="numeric"
        name="id"
      />
    </div>

    <div>
      <label for="name">Nom:</label>
      <input
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full input input-bordered"
        name="name"
      />
    </div>

    <div>
      <label for="version">Version actuelle:</label>
      <input
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full input input-bordered"
        name="version"
      />
    </div>

    <div>
      <label for="tversion">Version de la traduction:</label>
      <input
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full input input-bordered"
        name="tversion"
      />
    </div>

    <div>
      <label for="tname">Status de la traduction:</label>
      <select
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full select-bordered select"
        name="tname"
        required
      >
        <option>Traduction</option>
        <option>Traduction (mod inclu)</option>
        <option>Intégrée</option>
        <option>Pas de traduction</option>
      </select>
    </div>

    <div>
      <label for="tlink">Lien de la traduction:</label>
      <input
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full input input-bordered"
        name="tlink"
      />
    </div>

    <div>
      <label for="status">Status:</label>
      <select
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full select-bordered select"
        name="status"
        required
      >
        <option>EN COURS</option>
        <option>TERMINÉ</option>
        <option>ABANDONNÉ</option>
      </select>
    </div>

    <div>
      <label for="link">Lien:</label>
      <input
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full input input-bordered"
        name="link"
      />
    </div>

    <div>
      <label for="tags">Tags:</label>
      <textarea
        id="tags"
        name="tags"
        placeholder="Tags"
        class="w-full textarea textarea-bordered textarea-xs max-h-24"
      ></textarea>
    </div>

    <div>
      <label for="type">Type:</label>
      <select
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full select-bordered select"
        name="type"
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
      <label for="traductor">Traducteur:</label>
      <input
        placeholder="Traducteur"
        type="search"
        id="traductor"
        class="w-full select select-bordered"
        list="traductor-list"
      />
      <datalist id="traductor-list"></datalist>
    </div>

    <div>
      <label for="reader">Relecteur:</label>
      <input
        placeholder="Relecteur"
        type="search"
        id="reader"
        class="w-full select select-bordered"
        list="reader-list"
      />
      <datalist id="reader-list"></datalist>
    </div>

    <div>
      <label for="ttype">Type de Traduction:</label>
      <select
        type="text"
        placeholder="Rechercher un jeu"
        class="w-full select-bordered select"
        name="ttype"
        required
      >
        <option>Traduction Humaine</option>
        <option>Traduction Automatique</option>
        <option>Traduction Semi-Automatique</option>
        <option>VO Française</option>
        <option>À tester</option>
      </select>
    </div>

    <div class="flex items-end">
      <div class="flex items-center justify-center w-full h-12 gap-2">
        <label for="ac">Auto-Check:</label>
        <input type="checkbox" class="checkbox checkbox-lg" />
      </div>
    </div>
  </div>
  <button class="w-48 btn btn-primary">Éditer le jeu</button>
</div>

<Modal id="add_admin_modal" title="Supprimer le jeu">
  <div slot="modal-content">
    <p class="py-4">Êtes-vous sûr de vouloir supprimer ce jeu ?</p>
    <textarea
      placeholder="Pourquoi veux-tu supprimer le jeu ?"
      class="textarea textarea-bordered max-h-32"
    ></textarea>
  </div>
  <button slot="modal-action" on:click class="btn">Supprimer</button>
</Modal>
