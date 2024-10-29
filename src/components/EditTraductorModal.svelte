<script lang="ts">
import { preventDefault } from 'svelte/legacy';

import { GAS_API } from '$lib/GAS_API';
import { isLoading, traductors } from '$lib/stores';
import { createEventDispatcher } from 'svelte';
import { get } from 'svelte/store';
import Modal from './Modal.svelte';

interface Props {
  showModal: boolean;
  index: number;
}

let { showModal = $bindable(), index }: Props = $props();

const dispatch = createEventDispatcher();

let localTraductor = $state({ ...get(traductors)[index] });
const queryName = localTraductor.name;

const handleSubmit = async () => {
  $isLoading = true;
  try {
    await GAS_API.putTraductor({ query: { name: queryName }, data: localTraductor });

    let newTraductors = get(traductors);
    newTraductors[index] = localTraductor;
    traductors.set(newTraductors);

    showModal = false;

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'success',
      message: 'Le traducteur a bien été modifié',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Error adding game', error);

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'error',
      message: 'Impossible de modifier le traducteur',
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};

const addLink = () => {
  if (localTraductor.links.find((link) => link.name === '')) return;

  localTraductor.links = [...localTraductor.links, { name: '', link: '' }];
};
</script>

<Modal bind:showModal title="Modifier traducteur/relecteur">
  <!-- @migration-task: migrate this slot by hand, `modal-content` is an invalid identifier -->
  <div slot="modal-content" class="mt-4">
    <input
      type="text"
      placeholder="Nom du traducteur/relecteur"
      class="input input-bordered w-full appearance-none"
      bind:value={localTraductor.name}
      />
    <h2>Modifier les liens du traducteur/relecteur</h2>
    <ul class="flex flex-col gap-2">
      {#each localTraductor.links as {name, link}, linkIndex}
        <li class="flex gap-2">
          <input
            type="text"
            placeholder="Nom du lien"
            class="input input-xs input-bordered w-full appearance-none"
            bind:value={localTraductor.links[linkIndex].name}
            />
          <input
            type="text"
            placeholder="Lien"
            class="input input-xs input-bordered w-full appearance-none"
            bind:value={localTraductor.links[linkIndex].link}
            />
          <button class="btn btn-ghost btn-xs" onclick={preventDefault(() => {
            localTraductor.links.splice(linkIndex, 1);
            localTraductor = { ...localTraductor, links: [...localTraductor.links] };
          })}>X</button>
        </li>
      {:else}
        <li>Il n'y a actuellement aucun lien</li>
      {/each}
    </ul>
  </div>

  <!-- @migration-task: migrate this slot by hand, `modal-action` is an invalid identifier -->
  <div slot="modal-action" class="mt-4">
    <button
      class="btn"
      onclick={preventDefault(addLink)}>
      Ajouter un lien
    </button>
    
    <button
      class="btn"
      onclick={preventDefault(handleSubmit)}>
      Valider
    </button>
  </div>
</Modal>
