<script lang="ts">
import { traductors } from '$lib/stores';
import Modal from './Modal.svelte';

export let showModal: boolean;

let name = '';
</script>

<Modal bind:showModal title="Ajouter un traducteur">
  <div slot="modal-content" class="mt-4">
    <input
      type="text"
      placeholder="Nom du traducteur"
      class="input input-bordered w-full appearance-none"
      on:input={e => name = e.currentTarget.value}
      />
  </div>

  <button
    slot="modal-action"
    class="btn"
    on:click|preventDefault={() => {
      if ($traductors.find((traductor) => traductor.name === name)) return

      let newTraductors = $traductors
      newTraductors.push({name, links: []})
      $traductors = newTraductors

      showModal = false
    }}>
    Valider
  </button>
</Modal>
