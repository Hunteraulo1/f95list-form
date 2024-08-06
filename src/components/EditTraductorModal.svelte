<script lang="ts">
import { traductors } from '$lib/stores';
import Modal from './Modal.svelte';

export let showModal: boolean;
export let index: number;

let traductor = $traductors[index]; // Obtenir une copie des traducteurs depuis le store
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
            $traductors[index] = traductor;
          }}>X</button>
        </li>
      {:else}
        <li>Il n'y a actuellement aucun lien</li>
      {/each}
    </ul>
  </div>

  <div slot="modal-action" class="mt-4">
    <button
      class="btn"
      on:click={() => {
        if (traductor.links.find((link) => link.name === '')) return

        traductor.links.push({ name: '', link: '' });
        $traductors[index] = traductor;
        console.log(traductor);
      }}>
      Ajouter un lien
    </button>
    
    <button
      class="btn"
      on:click={() => {
        let newTraductors = $traductors
        newTraductors.splice(index, 1)
        $traductors = newTraductors
      }}>
      Supprimer le traducteur
    </button>
  </div>
</Modal>
