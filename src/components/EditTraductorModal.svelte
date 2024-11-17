<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, traductors } from '$lib/stores';
import type { TraductorType } from '$types/schemas';
import { Icon, XMark } from 'svelte-hero-icons';
import { get } from 'svelte/store';
import Modal from './Modal.svelte';

interface Props {
  showModal: boolean;
  index: number;
}

let { showModal = $bindable(), index }: Props = $props();

let localTraductor: TraductorType | undefined = $state({ ...get(traductors)[index] });

const handleSubmit = async () => {
  if (!localTraductor) return;
  $isLoading = true;
  try {
    await GAS_API.putTraductor({ query: { name: localTraductor.name }, data: localTraductor });

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

const handleAddLink = (e: Event) => {
  e.preventDefault();

  if (!localTraductor) return;

  if (localTraductor.links.find((link) => link.name === '')) return;

  localTraductor.links = [...localTraductor.links, { name: '', link: '' }];
};

const handleRemoveLink = (e: Event, linkIndex: number) => {
  e.preventDefault();

  if (!localTraductor) return;

  localTraductor.links.splice(linkIndex, 1);
  localTraductor = { ...localTraductor, links: [...localTraductor.links] };
};
</script>

<Modal bind:showModal title="Modifier traducteur/relecteur">
  <div slot="modalContent" class="mt-4 flex flex-col gap-2">
    {#if localTraductor}

      <label for="name" class="label">Nom du traducteur/relecteur</label>
      <input
      type="text"
      placeholder="Nom du traducteur/relecteur"
      class="input input-bordered w-full appearance-none"
      bind:value={localTraductor.name}
      />

      <label for="discordID" class="label">ID Discord</label>
      <input
      type="text"
      placeholder="ID Discord"
      class="input input-bordered w-full appearance-none"
      bind:value={localTraductor.discordID}
      />


      <h2 class="label mt-4">Modifier les liens du traducteur/relecteur</h2>

      <ul class="flex flex-col gap-2">
        {#each localTraductor.links as link, linkIndex}
          <li class="flex gap-2">
            <input
              type="text"
              placeholder="Nom du lien"
              class="input input-xs input-bordered w-full appearance-none"
              value={link.name}
              oninput={(e) => {
                link.name = e.currentTarget.value;
              }}
            />
            <input
              type="text"
              placeholder="Lien"
              class="input input-xs input-bordered w-full appearance-none"
              value={link.link}
              oninput={(e) => {
                link.link = e.currentTarget.value;
              }}
            />
            <button class="btn btn-ghost btn-xs" onclick={(e) => handleRemoveLink(e, linkIndex)}><Icon src={XMark} /></button>
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
        onclick={handleAddLink}>
        Ajouter un lien
      </button>
      
      <button
        class="btn"
        onclick={handleSubmit}>
        Valider
      </button>
    </div>
</Modal>
