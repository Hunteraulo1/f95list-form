<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, queryGame } from '$lib/stores';
import { checkUser } from '$lib/utils';
import type { GameType } from '$types/schemas';
import { navigate } from 'svelte-routing';
import Modal from '../Modal.svelte';

interface Props {
  silentMode: boolean;
  game: GameType;
  handleUpdateSubmit?: (type: 'validated' | 'rejected') => void;
  editor?: boolean;
}

let { silentMode, game, handleUpdateSubmit, editor }: Props = $props();

let deleteModal = $state(false);
let comment = $state('');

const handleClickDelete = async () => {
  if (!comment) {
    console.log('no comment');

    newToast({
      alertType: 'warning',
      message: 'Veuillez entrer une raison pour supprimer le jeu',
    });

    return null;
  }
  $isLoading = true;

  if (checkUser(['traductor'])) {
    try {
      const result = await GAS_API.postSubmit({ query: $queryGame, game, type: 'delete', comment });

      if (result === 'duplicate') {
        newToast({
          alertType: 'warning',
          message: 'Une soumission existe déjà pour ce jeu',
        });

        return;
      }

      navigate('/');
      newToast({
        alertType: 'success',
        message: 'La suppression du jeu a bien été soumise',
      });
    } catch (error) {
      console.error('Error fetching game', error);

      newToast({
        alertType: 'error',
        message: 'Impossible de soumettre la suppression du jeu',
      });
    } finally {
      $isLoading = false;
    }

    if (editor) {
      editor = false;
    }

    return;
  }

  const { name, version } = $queryGame;
  try {
    const query = { name, version };

    await GAS_API.delGame({ query, comment, silentMode });

    navigate('/');
    newToast({
      alertType: 'success',
      message: 'Le jeu a bien été supprimé',
    });
  } catch (error) {
    console.error('Error deleting game', error);

    newToast({
      alertType: 'error',
      message: 'Impossible de supprimer le jeu',
    });
  } finally {
    $isLoading = false;
  }

  handleUpdateSubmit?.('validated');
};
</script>

<button
  class="btn btn-error w-full sm:w-48"
  type="button"
  onclick={() => { deleteModal = true }}>
  Supprimer le jeu
</button>

<Modal bind:showModal={deleteModal} title="Supprimer le jeu">
  {#snippet modalContent()}    
    <p class="py-4">Êtes-vous sûr de vouloir supprimer ce jeu ?</p>
    <textarea
      bind:value={comment}
      placeholder="Pourquoi voulez-vous supprimer le jeu ?"
      class="textarea textarea-bordered max-h-32 w-full">
    </textarea>
  {/snippet}
  {#snippet modalAction()}
    <button
      onclick={handleClickDelete}
      class="btn btn-error">
      Supprimer définitivement
    </button>
  {/snippet}
</Modal>
