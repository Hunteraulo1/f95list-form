<script lang="ts">
import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { getConvert } from '$lib/convert';
import { isLoading, newToast, sessionUser } from '$lib/stores';
import { dateFormat } from '$lib/utils';
import { onMount } from 'svelte';
import { Link } from 'svelte-routing';

import ViewSubmitModal from '$lib/components/ViewSubmitModal.svelte';
import type { SubmitType, UserType } from '$types/schemas';

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

<div>
  <Panel title="Soumissions">
    {#snippet description()}
    <p class="text-gray-500">Liste des soumissions en attente de validation</p>
    {/snippet}
    {#snippet panelContent()}
      {#if submits.length > 0 && users.length > 0}
        <div class="overflow-x-auto">
          <table class="table">
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
                    {#if user}
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
                              {user.profile.pseudo !== '' ? user.profile.pseudo : user.email}
                            </div>
                            <div>
                              <span class="badge badge-ghost badge-sm mr-2">{user.role}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    {:else}
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle h-12 w-12">
                            <img
                              src={'https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100'}
                              alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <h2>Utilisateur inconnu</h2>
                          <div class="font-bold">
                            {submit.email}
                          </div>
                        </div>
                      </div>
                    {/if}
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
                    {#if user}
                      <ViewSubmitModal bind:showModal={dialogView[index]} bind:submits={submits} {index} {user} />
                    {/if}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p>Il n'y a aucune soumission actuellement</p>
      {/if}
    {/snippet}
  </Panel>
</div>
