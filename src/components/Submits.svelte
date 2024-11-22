<script lang="ts">
import { Link } from 'svelte-routing';

import Panel from '$components/Panel.svelte';
import ViewSubmitModal from '$components/ViewSubmitModal.svelte';
import { getConvert } from '$lib/convert';
import type { SubmitType, UserType } from '$types/schemas';

interface Props {
  submits: SubmitType[];
  users: UserType[];
  editable?: boolean;
}

let { submits = $bindable([]), users, editable = false }: Props = $props();

const dialogView: boolean[] = $state([]);
</script>

<div>
  {#if submits.length > 0 && users.length > 0}
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
                {#if editable}
                  <th>Action</th>
                {/if}
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
                            {#each user?.roles as role}
                              <span class="badge badge-ghost badge-sm mr-2">{role}</span>
                            {/each}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td>
                    {submit.date}
                  </td>
                  <td>
                    {getConvert(submit.type, 'types')}
                  </td>
                  <td>
                    {getConvert(submit.status, 'status')}
                  </td>
                  {#if editable}
                    <td>
                      <button onclick={() => (dialogView[index] = true)} class="btn btn-ghost btn-xs">
                        Accèder
                      </button>
                      <ViewSubmitModal bind:showModal={dialogView[index]} bind:submits={submits} {index} {user} />
                    </td>
                  {/if}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/snippet}
    </Panel>
  {/if}
</div>
