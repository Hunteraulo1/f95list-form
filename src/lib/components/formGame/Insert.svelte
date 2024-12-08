<script lang="ts">
import { game, newToast } from '$lib/stores';
import Modal from '../Modal.svelte';

let insertModal = $state(false);
let insertObject: string = $state('');

const handleClickInsert = (): void => {
  if (!insertObject) {
    newToast({
      alertType: 'warning',
      message: 'Veuillez entrer les données de LC Extractor',
    });

    return;
  }

  Object.assign($game, JSON.parse(insertObject));

  $game.ac = false; // Reload view data
};
</script>

<button
  class="btn btn-info w-full sm:w-48"
  type="button"
  onclick={() => { insertModal = true }}>
  Insert Data
</button>

<Modal bind:showModal={insertModal} title="Insérer les données du jeu">
  {#snippet modalContent()}
    <p class="py-4">Veuillez coller les données de LC Extractor ?</p>
    <textarea
      placeholder="Données de LC Extractor"
      class="textarea textarea-bordered max-h-32 w-full"
      bind:value={insertObject}
    ></textarea>
  {/snippet}
  {#snippet modalAction()}
    <button onclick={handleClickInsert} class="btn btn-info">
      Envoyer
    </button>
  {/snippet}
</Modal>
