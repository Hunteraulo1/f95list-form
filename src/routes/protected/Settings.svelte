<script lang="ts">
import EditUserModal from '$components/EditUserModal.svelte';
import LoadingSpinner from '$components/LoadingSpinner.svelte';
import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { appConfiguration, isLoading, newToast } from '$lib/stores';
import { checkUser } from '$lib/utils';
import { onMount } from 'svelte';
import { Link } from 'svelte-routing';

import type { UserType } from '$types/schemas';

let users: UserType[] = $state([]);

onMount(async () => {
  try {
    users = await GAS_API.getUsers();
  } catch (error) {
    console.error('Error fetching users', error);
  }
});

const handleClick = async (): Promise<void> => {
  if ($appConfiguration !== null) {
    await updateAppConfiguration();
  } else {
    console.error('App configuration is null.');
  }
};

const updateAppConfiguration = async (): Promise<void> => {
  $isLoading = true;

  console.info('submitting app configuration update', $appConfiguration);

  try {
    await GAS_API.putAppConfiguration({
      appConfiguration: $appConfiguration,
    });

    newToast({
      alertType: 'success',
      message: "Configuration de l'application mise à jour !",
    });
  } catch (error) {
    console.error("Erreur de transmission des changements de l'utilisateur", error);
    newToast({
      alertType: 'error',
      message: "Vos modifications n'ont pas pu être enregistrées",
    });
  } finally {
    $isLoading = false;
  }
};

const dialogEdit: boolean[] = $state([]);

const isSuperAdmin = checkUser(['superAdmin']);
</script>

<div>
  {#if $appConfiguration}
    <Panel title="General">
      {#snippet button()}
        <button class="btn" onclick={handleClick} disabled={!isSuperAdmin}>
          Sauvegarder
        </button>
      {/snippet}
      {#snippet description()}
        <p class="text-gray-500">
          Modifiez les paramètres de l'application. N'oubliez pas de sauvegarder !
        </p>
      {/snippet}
      {#snippet panelContent()}
        <div class="flex w-full gap-8">
          <div class="w-full max-w-xs">
          <label class="label" for="app-name">
            <span class="label-text">Nom de l'application</span>
          </label>
          <input
            bind:value={$appConfiguration.appName}
            disabled={$isLoading || !isSuperAdmin}
            type="text"
            placeholder="Nom de l'application"
            class="input input-bordered w-full"
            name="app-name" />
        </div>
        <div class="w-full max-w-xs">
          <label class="label" for="app-update">
            <span class="label-text">Url du webhook des mise à jours</span>
          </label>
          <input
            bind:value={$appConfiguration.webhooks.update}
            disabled={$isLoading || !isSuperAdmin}
            type="text"
            placeholder="url du webhook"
            class="input input-bordered w-full"
            name="app-update" />
        </div>
        <div class="w-full max-w-xs">
          <label class="label" for="app-logs">
            <span class="label-text">Url du webhook des logs</span>
          </label>
          <input
            bind:value={$appConfiguration.webhooks.logs}
            disabled={$isLoading || !isSuperAdmin}
            type="text"
            placeholder="url du webhook"
            class="input input-bordered w-full"
            name="app-logs" />
          </div>
          <div class="w-full max-w-xs">
            <label class="label" for="app-traductor">
              <span class="label-text">Url du webhook des traducteurs</span>
            </label>
            <input
              bind:value={$appConfiguration.webhooks.traductor}
              disabled={$isLoading || !isSuperAdmin}
              type="text"
              placeholder="url du webhook"
              class="input input-bordered w-full"
              name="app-traductor" />
          </div>
        </div>
      {/snippet}
    </Panel>

    <Panel title="Utilisateurs">
      {#snippet description()}
        <p class="text-gray-500">Liste des utilisateurs</p>
      {/snippet}
      {#snippet panelContent()}
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {#each users as user, index}
                <tr>
                  <td>
                    <Link to="/user/{user.email}">
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle h-12 w-12">
                            <img
                              src={user.profile?.imageUrl ||
                                "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"}
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
                  </td>
                  <th>
                    <button onclick={() => {dialogEdit[index] = true}} class="btn btn-ghost btn-xs">
                      Modifier
                    </button>
                    <EditUserModal bind:showModal={dialogEdit[index]} {user} bind:users={users} />
                  </th>
                </tr>
              {:else}
                <tr>
                  <td class="flex justify-center items-center">
                    <LoadingSpinner />
                    Chargement des utilisateurs...
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/snippet}
    </Panel>
  {/if}
</div>
