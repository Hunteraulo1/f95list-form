<script lang="ts">
import { Link } from 'svelte-routing';

import Panel from '$components/Panel.svelte';
import ViewSubmitModal from '$components/ViewSubmitModal.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast } from '$lib/stores';
import type { SubmitType, UserType } from '$types/schemas';
import { onMount } from 'svelte';

let submits: SubmitType[] = $state([]);
let users: UserType[] = $state([]);

onMount(async () => {
  submits = await GAS_API.getSubmits({});

  users = await GAS_API.getUsers();

  console.info('submits', submits);
});

const updateSubmits = async () => {
  $isLoading = true;

  console.info('submitting submits update');

  try {
    newToast({
      id: Date.now().toString(),
      alertType: 'success',
      message: 'Soumissions mises à jour !',
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Erreur de transmission des soumissions', error);
    newToast({
      id: Date.now().toString(),
      alertType: 'error',
      message: "Vos modifications n'ont pas pu être enregistrées",
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};

const dialogView: boolean[] = $state([]);
</script>

<div>
  {#if submits.length > 0}
    <Panel title="Soumissions">
      <p class="text-gray-500" slot="description">Liste des soumissions en attente de validation</p>
      <div slot="panelContent">
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
                    {submit.type}
                  </td>
                  <td>
                    {submit.status}
                  </td>
                  <td>
                    <button onclick={() => (dialogView[index] = true)} class="btn btn-ghost btn-xs">
                      Accèder
                    </button>
                    <ViewSubmitModal bind:showModal={dialogView[index]} {submit} />
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>
  {/if}
</div>
