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
let sortedSubmits: SubmitType[] = $state([]);
let users: UserType[] = $state([]);

onMount(async () => {
  if (!$sessionUser) return;
  $isLoading = true;

  try {
    submits = await GAS_API.getSubmits({});
    sortedSubmits = submits;

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

const handleClick = (element: HTMLTableCellElement, target: keyof SubmitType): void => {
  let reverse = false;

  if (element.children.length === 0) {
    element.parentElement?.querySelector('.sorted')?.remove();

    const span = document.createElement('span');

    span.classList.value = 'sorted';
    span.style.paddingLeft = '.25rem';
    span.textContent = '⤓';
    element.appendChild(span);
  } else {
    const span = element.children[0];

    if (span.textContent === '⤓') {
      span.textContent = '⤒';
      reverse = true;
    } else {
      span.textContent = '⤓';
    }
  }

  sortedSubmits = [...submits].sort((a, b) => {
    if (!a[target] || !b[target]) return 0;

    if (a[target] < b[target]) {
      return reverse ? 1 : -1;
    }

    if (a[target] > b[target]) {
      return reverse ? -1 : 1;
    }

    return 0;
  });
};
</script>

<div>
  <Panel title="Soumissions">
    {#snippet description()}
    <p class="text-gray-500">Liste des soumissions en attente de validation</p>
    {/snippet}
    {#snippet panelContent()}
      {#if sortedSubmits.length > 0 && users.length > 0}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th onclick={({currentTarget}) => handleClick(currentTarget, 'email')} class="cursor-pointer">Email</th>
                <th onclick={({currentTarget}) => handleClick(currentTarget, 'date')} class="cursor-pointer">Date</th>
                <th onclick={({currentTarget}) => handleClick(currentTarget, 'type')} class="cursor-pointer">Type</th>
                <th onclick={({currentTarget}) => handleClick(currentTarget, 'status')} class="cursor-pointer">Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {#each sortedSubmits as submit, index}
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
                    <button onclick={() => (dialogView[index] = true)} class="btn btn-ghost btn-xs" disabled={!user}>
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
