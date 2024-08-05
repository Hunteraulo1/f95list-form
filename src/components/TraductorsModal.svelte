<script lang="ts">
import Modal from './Modal.svelte';

import type { TraductorType } from '$types/schemas';

export let showModal: boolean;
export let traductor: TraductorType;

let { name, links } = traductor;
</script>

<Modal bind:showModal title="Modifier les liens du traducteur">
  <div slot="modal-content" class="mt-4">
    {#if links && links?.length > 0}
      <ul class="flex flex-col gap-2">
        {#each links as { name, link }}
          <li class="flex gap-2">
            <input
              type="text"
              placeholder="Nom du lien"
              class="number-input input input-xs input-bordered w-full appearance-none"
              value={name}
              />
            <input
              type="text"
              placeholder="Lien"
              class="number-input input input-xs input-bordered w-full appearance-none"
              value={link}
              />
            <button class="btn btn-ghost btn-xs" on:click|preventDefault>X</button>
          </li>
        {/each}
      </ul>
    {:else}
      Il n'y a actuellement aucun lien
    {/if}
  </div>

  <button
    slot="modal-action"
    class="btn"
    on:click|preventDefault>
    Ajouter un lien
  </button>
</Modal>
