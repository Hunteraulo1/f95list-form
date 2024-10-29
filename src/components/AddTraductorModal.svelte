<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, traductors } from '$lib/stores';
import { createEventDispatcher } from 'svelte';
import Modal from './Modal.svelte';

interface Props {
  showModal: boolean;
  name?: string;
}

let { showModal = $bindable(), name = $bindable('') }: Props = $props();

const dispatch = createEventDispatcher();

const handleSubmit = async () => {
  if (name === '') {
    return dispatch('newToast', {
      id: Date.now(),
      alertType: 'warning',
      message: "Il est impossible de créer un traducteur qui n'a pas de nom",
      milliseconds: 3000,
    });
  }

  if ($traductors.find((traductor) => traductor.name.toLowerCase() === name.toLowerCase())) {
    return dispatch('newToast', {
      id: Date.now(),
      alertType: 'warning',
      message: 'Le traducteur existe déjà',
      milliseconds: 3000,
    });
  }

  let newTraductor = { name: name ?? '', links: [] };

  $isLoading = true;
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

    let newTraductors = $traductors;
    newTraductors.push(newTraductor);
    $traductors = newTraductors;

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
      message: "Impossible d'ajouter le traducteur",
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};
</script>

<Modal bind:showModal title="Ajouter un traducteur/relecteur">
  <div slot="modalContent" class="mt-4">
    <input
      type="text"
      placeholder="Nom du traducteur/relecteur"
      class="input input-bordered w-full appearance-none"
      value={name}
      oninput={e => name = e.currentTarget.value}
      />
  </div>


  <div slot="modalAction" class="mt-4">
    <button
      class="btn"
      onclick={handleSubmit}>
      Valider
    </button>
  </div>
</Modal>
