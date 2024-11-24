<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, sessionUser } from '$lib/stores';
import type { SubmitType, UserType } from '$types/schemas';
import { onMount } from 'svelte';
import { Link } from 'svelte-routing';

import Panel from '$components/Panel.svelte';
import ViewSubmitModal from '$components/ViewSubmitModal.svelte';
import { getConvert } from '$lib/convert';
import { dateFormat } from '$lib/utils';

const dialogView: boolean[] = $state([]);

let submits: SubmitType[] = $state([]);
let users: UserType[] = $state([]);

onMount(async () => {
  if (!$sessionUser) return;
  $isLoading = true;

  try {
    submits = await GAS_API.getSubmits({});

    users = await GAS_API.getUsers();
  } catch (error) {
    console.error(error);

    newToast({
      message: 'Une erreur est survenue lors de la récupération des soumissions',
      alertType: 'error',
    });
  } finally {
    $isLoading = false;
  }
});
</script>

{#if submits.length > 0 && users.length > 0}
  <div>
    <Panel title="Soumissions">
      {#snippet description()}
        <p class="text-gray-500">Liste des soumissions en attente de validation</p>
      {/snippet}
      {#snippet panelContent()}
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Email</th>
                <th>Date</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {#each submits as submit, index}
                {@const user = users.find((user) => user.email === submit.email) as UserType}
                <tr>
                  <td>
                    <Link to="/user/{submit.email}">
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle h-12 w-12">
                            <img
                              src={user?.profile?.imageUrl ||
                                'https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100'
                              }
                              alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div class="font-bold">
                            {submit.email}
                          </div>
                          <div>
                            <span class="badge badge-ghost badge-sm mr-2">{user.role}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
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
                    <button onclick={() => (dialogView[index] = true)} class="btn btn-ghost btn-xs">
                      Accèder
                    </button>
                    <ViewSubmitModal bind:showModal={dialogView[index]} bind:submits={submits} {index} {user} />
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="5" class="text-center">
                    Aucune soumission pour le moment
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
