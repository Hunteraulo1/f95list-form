<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, traductors } from '$lib/stores';
import { createEventDispatcher } from 'svelte';
import Modal from './Modal.svelte';

export let showModal: boolean;
export let index: number;

const queryName: string = $traductors[index].name;
console.log('🚀 ~ queryName:', queryName);

let traductor = $traductors[index]; // Obtenir une copie des traducteurs depuis le store

const dispatch = createEventDispatcher();

const handleSubmit = async () => {
  $isLoading = true;
  try {
    await GAS_API.putTraductor({ query: { name: queryName }, data: traductor });

    let newTraductors = $traductors;
    newTraductors.push(traductor);
    $traductors = newTraductors;

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
</script>

<Modal bind:showModal title="Modifier les liens du traducteur/relecteur">
  <div slot="modal-content" class="mt-4">
    <ul class="flex flex-col gap-2">
      {#each traductor.links || [] as {name, link}, linkIndex (name+link)}
        <li class="flex gap-2">
          <input
            type="text"
            placeholder="Nom du lien"
            class="input input-xs input-bordered w-full appearance-none"
            bind:value={name}
            />
          <input
            type="text"
            placeholder="Lien"
            class="input input-xs input-bordered w-full appearance-none"
            bind:value={link}
            />
            <button class="btn btn-ghost btn-xs" on:click|preventDefault={() => {
            traductor.links.splice(linkIndex, 1);
          }}>X</button>
        </li>
      {:else}
        <li>Il n'y a actuellement aucun lien</li>
      {/each}
    </ul>
  </div>
  
  <div slot="modal-action" class="mt-4">
    <!-- TODO: implement delete traductor feature -->
    <!-- <button
      class="btn"
      on:click|preventDefault={() => {
        let newTraductors = $traductors
        newTraductors.splice(index, 1)
        $traductors = newTraductors
      }}>
      Supprimer le traducteur
    </button> -->
    
    <button
      class="btn"
      on:click|preventDefault={() => {
        if (traductor.links.find((link) => link.name === '')) return

        traductor.links.push({ name: '', link: '' });
      }}>
      Ajouter un lien
    </button>
    
    <button
      class="btn"
      on:click|preventDefault={() => handleSubmit()}>
      Valider
    </button>
    
  </div>
</Modal>
