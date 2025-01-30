<script lang="ts">
import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { getConvert } from '$lib/convert';
import { isLoading, newToast, sessionUser } from '$lib/stores';
import { dateFormat } from '$lib/utils';
import { onMount } from 'svelte';

import type { SubmitType } from '$types/schemas';

let submits: SubmitType[] = $state([]);

onMount(async () => {
  if (!$sessionUser) return;
  $isLoading = true;

  try {
    submits = await GAS_API.getSubmits({ user: $sessionUser });
  } catch (error) {
    console.error(error);

    newToast({
      message: 'Une erreur est survenue lors de la récupération des soumissions',
      alertType: 'error',
    });
  } finally {
    $isLoading = false;
  }

  console.info('submits ~ args:', submits);
});
</script>

<div>
  <Panel title="Mes soumissions">
    {#snippet description()}
    <p class="text-gray-500">Liste des soumissions en attente de validation</p>
    {/snippet}
    {#snippet panelContent()}
      {#if submits.length > 0}
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Nom du jeu (version)</th>
                <th>Date</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Raison</th>
              </tr>
            </thead>
            <tbody>
              {#each submits as submit}
                <tr>
                  <td>
                    <div class="font-bold">
                      {submit.game.name}
                    </div>
                    <span class="badge badge-ghost badge-sm mr-2">
                      {#if submit.game.version !== submit.query?.version}
                        {submit.query?.version} → {submit.game.version}
                      {:else}
                        {submit.game.version}
                      {/if}
                    </span>
                  </td>
                  <td>
                    {dateFormat(new Date(submit.date))}
                  </td>
                  <td>
                    {getConvert(submit.type, 'types')}
                  </td>
                  <td>
                    {getConvert(submit.status, 'status')}
                  </td>
                  <td>
                    {submit.reason}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p>Vous n'avez aucune soumission actuellement</p>
      {/if}
    {/snippet}
  </Panel>
</div>
