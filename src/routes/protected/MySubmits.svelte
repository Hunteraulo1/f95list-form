<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, sessionUser } from '$lib/stores';
import type { SubmitType, UserType } from '$types/schemas';
import { onMount } from 'svelte';

import Panel from '$components/Panel.svelte';
import { getConvert } from '$lib/convert';
import { dateFormat } from '$lib/utils';

let submits: SubmitType[] = $state([]);
const users: UserType[] = $state([]);

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

  console.info('submits', submits);
});
</script>

{#if submits.length > 0}
  <div>
    <Panel title="Mes soumissions">
      {#snippet description()}
        <p class="text-gray-500">Liste des soumissions en attente de validation</p>
      {/snippet}
      {#snippet panelContent()}
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Nom du jeu (version)</th>
                <th>Date</th>
                <th>Type</th>
                <th>Statut</th>
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
                        {submit.game.version} → {submit.query?.version}
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
                </tr>
              {:else}
                <tr>
                  <td colspan="4" class="text-center">
                    Vous n'avez pas soumis de traduction
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/snippet}
    </Panel>
  </div>
{/if}
