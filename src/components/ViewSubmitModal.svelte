<script lang="ts">
import Modal from './Modal.svelte';

import { isLoading, newToast } from '$lib/stores';
import type { SubmitType } from '$types/schemas';

interface Props {
  submit: SubmitType;
  showModal: boolean;
}

let { submit = $bindable(), showModal = $bindable() }: Props = $props();

const handleAdminRemovalSubmit = async () => {
  console.info('removing admin status from user', submit);

  $isLoading = true;

  try {
    // const result = await GAS_API.putSubmit(submit);

    // console.info('Submit updated:', result);

    newToast({
      id: Date.now().toString(),
      alertType: 'success',
      message: 'Soumission mise à jour!',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Could not update submit:', error);

    newToast({
      id: Date.now().toString(),
      alertType: 'error',
      message: 'Erreur lors de la mise à jour de la soumission',
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};
</script>

<Modal bind:showModal title="Voir la soumission">
  <div slot="modalContent">
    <div class="my-2 flex items-center space-x-3 p-2 hover:cursor-pointer hover:bg-base-200">
      <div class="flex items-center justify-center space-x-3">
        <div class="mask mask-squircle h-12 w-12">
          <img
            src={submit.game.image ||
              "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"}
            alt="Game" />
        </div>
        <div>
          <div class="font-bold">{submit.email}</div>
        </div>
      </div>
    </div>
  </div>
  <button slot="modalAction" onclick={handleAdminRemovalSubmit} disabled={!submit} class="btn">Confirmer</button>
</Modal>
