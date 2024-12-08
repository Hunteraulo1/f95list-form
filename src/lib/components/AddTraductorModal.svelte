<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, traductors } from '$lib/stores';
import Modal from './Modal.svelte';

interface Props {
  showModal: boolean;
  name?: string;
}

let { showModal = $bindable(), name = $bindable('') }: Props = $props();

const handleSubmit = async (): Promise<void> => {
  if (name === '') {
    return newToast({
      alertType: 'warning',
      message: "Il est impossible de créer un traducteur qui n'a pas de nom",
    });
  }

  if ($traductors.find((traductor) => traductor.name.toLowerCase() === name.toLowerCase())) {
    return newToast({
      alertType: 'warning',
      message: 'Le traducteur existe déjà',
    });
  }

  const newTraductor = { name: name ?? '', links: [], discordID: '' };

  $isLoading = true;
  try {
    const result = await GAS_API.postTraductor({ traductor: newTraductor });

    if (result === 'duplicate') {
      newToast({
        alertType: 'warning',
        message: 'Le traducteur existe déjà',
      });

      return;
    }

    const newTraductors = $traductors;
    newTraductors.push(newTraductor);
    $traductors = newTraductors;

    showModal = false;

    newToast({
      alertType: 'success',
      message: 'Le traducteur a bien été ajouté',
    });
  } catch (error) {
    console.error('Error adding game', error);

    newToast({
      alertType: 'error',
      message: "Impossible d'ajouter le traducteur",
    });
  } finally {
    $isLoading = false;
  }
};
</script>

<Modal bind:showModal title="Ajouter un traducteur/relecteur">
  {#snippet modalContent()}
    <input
      type="text"
      placeholder="Nom du traducteur/relecteur"
      class="input input-bordered w-full appearance-none"
      value={name}
      oninput={e => name = e.currentTarget.value}
    />
  {/snippet}

  {#snippet modalAction()}
    <button
      class="btn"
      onclick={handleSubmit}>
      Valider
    </button>
  {/snippet}
</Modal>
