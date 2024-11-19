<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import checkUser from '$lib/checkUser';
import { isLoading, newToast, queryGame } from '$lib/stores';
import type { GameType } from '$types/schemas';
import { navigate } from 'svelte-routing';
import Modal from './Modal.svelte';

interface Props {
  comment: string;
  silentMode: boolean;
  game: GameType;
}

let { comment, silentMode, game }: Props = $props();

let deleteModal = $state(false);

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
</script>

<button
  class="btn btn-error w-full sm:w-48"
  type="button"
  onclick={() => {
    deleteModal = true;
  }}>
  Supprimer le jeu
</button>

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
