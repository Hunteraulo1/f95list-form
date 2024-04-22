<script lang="ts">
  import { GAS_API } from '$lib/GAS_API'
  import type { TraductorType } from '$types/schemas'
  import { createEventDispatcher, onMount } from 'svelte'

  const dispatch = createEventDispatcher()

  let traductors: TraductorType[] = []

  onMount(async () => {
    try {
      traductors = await GAS_API.getTraductors()

      if (!Array.isArray(traductors)) {
        throw new Error('getTraductor no result')
      }
    } catch (error) {
      console.error('Error deleting game', error)

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: 'Impossible de récupérer la liste des traducteurs',
        milliseconds: 3000
      })
    }
  })
</script>

<div class="overflow-x-auto">
  {#if traductors && traductors.length > 0}
    <table class="table text-center">
      <thead>
        <tr>
          <th class="w-0" />
          <th class="w-1/4">Traducteur/Relecteur</th>
          <th>Pages</th>
          <th class="w-0">Action</th>
        </tr>
      </thead>
      <tbody>
        {#each traductors as traductor, index}
          <tr>
            <th>{index + 1}</th>
            <td class="text-primary font-bold">{traductor.name}</td>
            <td>
              <ul>
                {#if traductor.links && traductor.links.length > 0}
                  {#each traductor.links as link}
                    <li class="text-secondary">
                      <a href={link.link}>{link.name}</a>
                    </li>
                  {/each}
                {:else}
                  <li class="text-xs">Aucun lien disponible</li>
                {/if}
              </ul>
            </td>
            <td>
              <button class="btn btn-primary btn-xs"> Modifier </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <p class="w-full flex justify-center">Aucun traducteur disponible</p>
  {/if}
</div>
