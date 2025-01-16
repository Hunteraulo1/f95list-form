<script lang="ts">
import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast } from '$lib/stores';
import { onMount } from 'svelte';
import { Icon, PencilSquare, PlusCircle } from 'svelte-hero-icons';

import { checkUser } from '$lib/utils';
import type { UserType } from '$types/schemas';

interface Props {
  email: string;
}

const { email }: Props = $props();

const loading = false;

let user: UserType | undefined = $state(undefined);

const fetchUser = async (): Promise<void> => {
  $isLoading = true;

  console.info('fetching user data for profile...');

  try {
    const result = await GAS_API.getUser({ email });

    user = result;
    console.info('User data:', user);
  } catch (error) {
    console.error('Could not get user data:', error);

    newToast({
      alertType: 'error',
      message: 'Impossible de récupérer les information utilisateur',
    });
  } finally {
    console.info('User data loaded.');

    $isLoading = false;
  }
};

const deleteLogs = async (): Promise<void> => {
  if (!user) return;

  $isLoading = true;

  console.info('removing user activities...');

  try {
    await GAS_API.delActivity({ email });

    user = { ...user, activity: [] };

    newToast({
      alertType: 'success',
      message: "Les logs de l'utilisateur on été supprimés avec succès",
    });
  } catch (error) {
    console.error('Could not remove user activities:', error);

    newToast({
      alertType: 'error',
      message: "Impossible de supprimer les logs de l'utilisateur",
    });
  } finally {
    $isLoading = false;
  }
};

onMount(() => fetchUser());
</script>

{#if user && !loading}
  <div class="flex flex-row">
    <div class="flex flex-col px-12 py-2">
      <div class="avatar mb-4">
        <div class="w-32 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100">
          <img
            src={user.profile.imageUrl ||
              "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100"}
            alt="The user" />
        </div>
      </div>
      <div class="py-1">
        <h2 class="card-title">
          {user.profile.pseudo}
        </h2>
      </div>
      <div class="py-1">
        <span>{user.email}</span>
      </div>
      <div class="py-1">
        <span class="badge">{user.role.toUpperCase()}</span>
      </div>
    </div>
    <div class="flex flex-grow flex-col items-center">
      <!-- TODO: implement stats for traductors -->
      {#if user.role === 'admin' || user.role === 'superAdmin'}
        <div class="stats w-full shadow">
          <div class="stat">
            <div class="stat-figure text-primary">
              <Icon src={PlusCircle} size="2.5rem" />
            </div>
            <div class="stat-title">Total de jeu ajouté</div>
            <div class="stat-value text-primary">{user.statistics.gameAdded}</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <Icon src={PencilSquare} size="2.5rem" />
            </div>
            <div class="stat-title">Total de jeu modifié</div>
            <div class="stat-value text-secondary">
              {user.statistics.gameEdited}
            </div>
          </div>
        </div>
      {/if}
      <Panel title="Activité récente" showDivider={false}>
        {#snippet panelContent()}
          <div class="overflow-x-auto">
            {#if checkUser(['superAdmin'])}
              <button class="btn btn-error btn-sm float-right" onclick={deleteLogs}>supprimer les logs</button>
            {/if}
            <table class="table">
              <!-- head -->
            <thead>
              <tr>
                <th>Évenement</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {#if user}
                {#each user.activity as record}
                <tr>
                  <td>{record.label}</td>
                  <td
                  >{new Date(record.value).toLocaleDateString("fr-FR", {
                    hour: "numeric",
                    minute: "numeric",
                  })}</td>
                  </tr>
                {/each}
              {/if}
            </tbody>
            </table>
          </div>
        {/snippet}
      </Panel>
    </div>
  </div>
{/if}
