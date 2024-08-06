<script lang="ts">
import { createEventDispatcher, onMount } from 'svelte';

import TraductorsModal from '$components/TraductorsModal.svelte';
import { GAS_API } from '$lib/GAS_API';
import { traductors } from '$lib/stores';

const dispatch = createEventDispatcher();

let showModal: boolean[] = [];

onMount(async () => {
  try {
    let data = await GAS_API.getTraductors();

    if (!Array.isArray(data)) {
      throw new Error('getTraductor no result');
    }

    $traductors = data;
  } catch (error) {
    console.error('Error deleting game', error);

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'error',
      message: 'Impossible de récupérer la liste des traducteurs',
      milliseconds: 3000,
    });
  }
});
</script>

<div class="overflow-x-auto">
  <table class="table text-center">
    <thead>
      <tr>
        <th class="w-0" />
        <th class="w-1/4">Traducteur/Relecteur</th>
        <th>Pages</th>
        <th class="w-0">Action</th>
      </tr>
    </thead>
    <tbody class="relative">
      {#each $traductors as traductor, index}
        <tr>
          <th>{index + 1}</th>
          <td class="font-bold text-primary">{traductor.name}</td>
          <td>
            <ul class="flex gap-2 justify-center">
              {#if traductor.links && traductor.links.length > 0}
                {#each traductor.links as link}
                  <li class="text-secondary">
                    <a href={link.link} target="_blank">{link.name}</a>
                  </li>
                  {/each}
                  {:else}
                  <li class="text-xs">Aucun lien disponible</li>
                  {/if}
                </ul>
          </td>
          <td>
            <button class="btn btn-primary btn-xs" on:click={() => showModal[index] = true}>Modifier</button>
          </td>
        </tr>
        <TraductorsModal bind:showModal={showModal[index]} {index} on:newToast />
        {:else}
          <p class="fixed flex w-full justify-center">Aucun traducteur disponible</p>
      {/each}
    </tbody>
  </table>
</div>
