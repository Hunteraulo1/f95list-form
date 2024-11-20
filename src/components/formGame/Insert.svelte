<script lang="ts">
import { newToast } from '$lib/stores';
import type { GameType } from '$types/schemas';
import Modal from '../Modal.svelte';

interface Props {
  game: GameType;
}

let { game }: Props = $props();

let insertModal = $state(false);
let insertObject: string = $state('');

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
</script>

<button
  class="btn btn-info w-full sm:w-48"
  type="button"
  onclick={() => { insertModal = true }}>
  Insert Data
</button>

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
