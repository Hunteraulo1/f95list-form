<script lang="ts">
  import Modal from '../components/Modal.svelte'
  import Search from '../components/Search.svelte'
  import type { Game } from '../types/types'

  let step: number = 0
  let stepDisablePrev = true
  let stepDisableNext = false

  let data: Game = {
    domain: 'F95z',
    id: null,
    name: null,
    link: null,
    status: 'EN COURS',
    tags: null,
    type: 'RenPy',
    version: null,
    tversion: null,
    tname: 'Traduction',
    tlink: null,
    traductor: null,
    reader: null,
    ttype: 'Traduction Humaine',
    ac: false
  }

  function changeStep(n: number) {
    if (step + n >= 0 && step + n <= 5) {
      step += n
    }

    if (
      (step === 1 && data.domain === 'Autre') ||
      (step === 4 && data.domain === 'Autre') ||
      (step === 2 && (data.domain === 'F95z' || data.domain === 'LewdCorner'))
    ) {
      step += n
    }

    stepDisablePrev = step <= 0
    stepDisableNext = step >= 5
  }

  function handleChange(this: {
    name: string
    value: string | number | boolean
  }) {
    // @ts-ignore
    data[this.name] = this.value
  }
</script>

<div class="flex flex-col items-center justify-center gap-4 mt-0">
  <Search />
  <!-- TODO: à supprimer -->
  <div class="relative flex flex-col items-center">
    <div
      class="grid grid-cols-1 gap-8 p-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {#if step === 0 || step === 5}
        <div>
          <label for="domain">Platforme:</label>
          <select
            placeholder="Rechercher un jeu"
            class="w-full select-bordered select"
            name="domain"
            value={data.domain}
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
            placeholder="Rechercher un jeu"
            class="w-full appearance-none input input-bordered number-input"
            pattern="[0-9]*"
            inputmode="numeric"
            name="id"
            on:change={handleChange}
            value={data.id}
          />
        </div>
      {/if}
      {#if step === 2 || step === 5}
        <div>
          <label for="name">Nom:</label>
          <input
            type="text"
            placeholder="Rechercher un jeu"
            class="w-full input input-bordered"
            name="name"
            on:change={handleChange}
            value={data.name}
          />
        </div>

        <div>
          <label for="link">Lien:</label>
          <input
            type="text"
            placeholder="Rechercher un jeu"
            class="w-full input input-bordered"
            name="link"
            on:change={handleChange}
            value={data.link}
          />
        </div>

        <div>
          <label for="status">Status:</label>
          <select
            placeholder="Rechercher un jeu"
            class="w-full select-bordered select"
            name="status"
            on:change={handleChange}
            value={data.status}
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
            placeholder="Tags"
            class="w-full textarea textarea-bordered textarea-xs max-h-24"
            on:change={handleChange}
            value={data.tags}
          ></textarea>
        </div>

        <div>
          <label for="type">Type:</label>
          <select
            placeholder="Rechercher un jeu"
            class="w-full select-bordered select"
            name="type"
            on:change={handleChange}
            value={data.type}
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
            placeholder="Rechercher un jeu"
            class="w-full input input-bordered"
            name="version"
            on:change={handleChange}
            value={data.version}
          />
        </div>
      {/if}
      {#if step === 3 || step === 5}
        <div>
          <label for="tversion">Version de la traduction:</label>
          <input
            type="text"
            placeholder="Rechercher un jeu"
            class="w-full input input-bordered"
            name="tversion"
            on:change={handleChange}
            value={data.tversion}
          />
        </div>

        <div>
          <label for="tname">Status de la traduction:</label>
          <select
            placeholder="Rechercher un jeu"
            class="w-full select-bordered select"
            name="tname"
            on:change={handleChange}
            value={data.tname}
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
            on:change={handleChange}
            value={data.tlink}
          />
        </div>

        <div>
          <label for="traductor">Traducteur:</label>
          <input
            placeholder="Traducteur"
            type="search"
            id="traductor"
            class="w-full select select-bordered"
            list="traductor-list"
            on:change={handleChange}
            value={data.traductor}
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
            on:change={handleChange}
            value={data.reader}
          />
          <datalist id="reader-list"></datalist>
        </div>

        <div>
          <label for="ttype">Type de Traduction:</label>
          <select
            placeholder="Rechercher un jeu"
            class="w-full select-bordered select"
            name="ttype"
            on:change={handleChange}
            value={data.ttype}
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
              value={data.ac}
            />
          </div>
        </div>
      {/if}
    </div>
    {#if step < 5}
      <div class="flex gap-4">
        <button
          class="w-48 btn btn-outline btn-primary"
          on:click={() => changeStep(-1)}
          disabled={stepDisablePrev}
        >
          Précédent
        </button>
        <button
          class="w-48 btn btn-primary"
          on:click={() => changeStep(1)}
          disabled={stepDisableNext}
        >
          Suivant
        </button>
      </div>
    {:else}
      <button class="w-48 btn btn-primary">Ajouter le jeu</button>
    {/if}
  </div>
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
