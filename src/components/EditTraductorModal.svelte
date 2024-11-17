<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, traductors } from '$lib/stores';
import type { TraductorType } from '$types/schemas';
import { get } from 'svelte/store';
import Modal from './Modal.svelte';

interface Props {
  showModal: boolean;
  index: number;
}

let { showModal = $bindable(), index }: Props = $props();

let localTraductor: TraductorType | undefined = $state();

$effect(() => {
  localTraductor = { ...get(traductors)[index] };
});

const queryName = $derived(localTraductor?.name);

const handleSubmit = async () => {
  if (!localTraductor || !queryName) return;
  $isLoading = true;
  try {
    await GAS_API.putTraductor({ query: { name: queryName }, data: localTraductor });

    let newTraductors = get(traductors);
    newTraductors[index] = localTraductor;
    traductors.set(newTraductors);

    showModal = false;

    newToast({
      id: Date.now().toString(),
      alertType: 'success',
      message: 'Le traducteur a bien été modifié',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Error adding game', error);

    newToast({
      id: Date.now().toString(),
      alertType: 'error',
      message: 'Impossible de modifier le traducteur',
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};

const addLink = () => {
  if (!localTraductor) return;

  if (localTraductor.links.find((link) => link.name === '')) return;

  localTraductor.links = [...localTraductor.links, { name: '', link: '' }];
};
</script>

<Modal bind:showModal title="Modifier traducteur/relecteur">
  <div slot="modalContent" class="mt-4">
    {#if localTraductor}
      <input
      type="text"
      placeholder="Nom du traducteur/relecteur"
      class="input input-bordered w-full appearance-none"
      bind:value={localTraductor.name}
      />

      <input
      type="text"
      placeholder="ID Discord"
      class="input input-bordered w-full appearance-none"
      bind:value={localTraductor.discordID}
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
            <button class="btn btn-ghost btn-xs" onclick={() => {
              if (!localTraductor) return;

              localTraductor.links.splice(linkIndex, 1);
              localTraductor = { ...localTraductor, links: [...localTraductor.links] };
            }}>X</button>
          </li>
        {:else}
          <li>Il n'y a actuellement aucun lien</li>
        {/each}
      </ul>
      {/if}
    </div>

    <div slot="modalAction" class="mt-4">
      <button
        class="btn"
        onclick={addLink}>
        Ajouter un lien
      </button>
      
      <button
        class="btn"
        onclick={handleSubmit}>
        Valider
      </button>
    </div>
</Modal>
