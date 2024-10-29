<script lang="ts">
  import { run } from 'svelte/legacy';

import { createEventDispatcher } from 'svelte';
import { Icon, PencilSquare, PlusCircle } from 'svelte-hero-icons';

import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading } from '$lib/stores';
import type { UserType } from '$types/schemas';

  interface Props {
    email: string;
  }

  let { email }: Props = $props();

const dispatch = createEventDispatcher();

let loading = false;

let user: UserType | undefined = $state(undefined);

const fetchUser = async () => {
  $isLoading = true;

  console.info('fetching user data for profile...');

  try {
    const result = await GAS_API.getUser({ email });

    user = result;
    console.info('User data:', user);
  } catch (error) {
    console.error('Could not get user data:', error);

    dispatch('newToast', {
      id: Date.now(),
      alertType: 'error',
      message: 'Impossible de récupérer les information utilisateur',
      milliseconds: 3000,
    });
  } finally {
    console.info('User data loaded.');

    $isLoading = false;
  }
};

// Fetch the user on mount
run(() => {
    fetchUser();
  });
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
        {#each user.roles as role}
          <span class="badge">{role.toUpperCase()}</span>
        {/each}
      </div>
    </div>
    <div class="flex flex-grow flex-col items-center">
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
      <Panel title="Activité récente" showDivider={false}>
        <!-- @migration-task: migrate this slot by hand, `panel-content` is an invalid identifier -->
  <div slot="panel-content" class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th> Évenement </th>
                <th> Date </th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  </div>
{/if}
