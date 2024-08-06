<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, traductors } from '$lib/stores';
import { createEventDispatcher } from 'svelte';
import Modal from './Modal.svelte';

export let showModal: boolean;

const dispatch = createEventDispatcher();

let name = '';

const handleSubmit = async () => {
  $isLoading = true;

  if ($traductors.find((traductor) => traductor.name === name)) return;

  let newTraductor = { name, links: [] };
  let newTraductors = $traductors;
  newTraductors.push(newTraductor);
  $traductors = newTraductors;

  try {
    const result = await GAS_API.postTraductor({ traductor: newTraductor });

    if (result === 'duplicate') {
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'warning',
        message: 'Le traducteur existe déjà',
        milliseconds: 3000,
      });

      return;
    }

    showModal = false;
    dispatch('newToast', {
      id: Date.now(),
      alertType: 'success',
      message: 'Le traducteur a bien été ajouté',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Error adding game', error);

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'error',
      message: "Impossible d'ajouter le jeu",
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};
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

    }}>
    Valider
  </button>
</Modal>
