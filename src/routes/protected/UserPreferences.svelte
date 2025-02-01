<script lang="ts">
import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, sessionUser } from '$lib/stores';
import { User, type UserType } from '$types/schemas';
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';

let users: UserType[] = $state([]);
let user: UserType | undefined = $state();

onMount(async () => {
  if (!$sessionUser) throw new Error('User not found');

  try {
    const result = await GAS_API.getUser({ email: 'dev' });

    const parsedUser = User.parse(result);

    if (!parsedUser) throw new Error('User not found');

    user = parsedUser;

    console.info('User:', user);

    if (user.role === 'superAdmin') {
      $isLoading = true;

      try {
        users = await GAS_API.getUsers();
      } catch (error) {
        console.error('Error fetching users', error);
      } finally {
        $isLoading = false;
      }
    }
  } catch (err) {
    console.error('Could not get user:', err); // TODO: dispatch toast
  } finally {
    console.info('User loaded.');

    $isLoading = false;
  }
});

const handleClick = async (): Promise<void> => {
  console.info('Button clicked!');

  if ($sessionUser) {
    await submitUserUpdate();
    $effect(() => {
      $sessionUser.preferences?.theme &&
        document.querySelector('html')?.setAttribute('data-theme', $sessionUser.preferences.theme);
    });
  }
};

const submitUserUpdate = async (): Promise<void> => {
  $isLoading = true;

  console.info('submitting user update', $sessionUser);

  try {
    if (!$sessionUser) return navigate('/');

    const result = await GAS_API.putUser({ user: $sessionUser });

    console.info('putUser ~ result:', result);
    newToast({
      alertType: 'success',
      message: "Mise à jour de l'utilisateur!",
    });
  } catch (error) {
    console.error('Error submitting user change', error);
    newToast({
      alertType: 'error',
      message: "Vos modifications n'ont pas pu être enregistrées",
    });
  } finally {
    $isLoading = false;
  }
};

const submitdevUserUpdate = async (): Promise<void> => {
  $isLoading = true;

  console.info('submitting devUser update', user);

  try {
    if (!user) return navigate('/');

    const result = await GAS_API.putUser({ user: user });

    console.info('putUser ~ result:', result);
    newToast({
      alertType: 'success',
      message: 'Mise à jour devUser!',
    });
  } catch (error) {
    console.error('Error submitting devUser change', error);
    newToast({
      alertType: 'error',
      message: "Vos modifications du devUser n'ont pas pu être enregistrées",
    });
  } finally {
    $isLoading = false;
  }
};
</script>

{#if $sessionUser}
  <div>
    <Panel title="Informations de profil">
      {#snippet panelContent()}        
        <p class="text-gray-500">
          Les informations contenues dans cette section sont affichées sur votre page de profil.
        </p>
        <div class="flex gap-8">
          <div class="form-control w-full max-w-xs">
            <label class="label" for="first-name">
              <span class="label-text">Pseudo</span>
            </label>
            <input
              bind:value={$sessionUser.profile.pseudo}
              disabled={$isLoading}
              type="text"
              placeholder="Tapez ici"
              class="input input-bordered w-full max-w-xs"
              name="first-name" />
          </div>
          <div class="form-control w-full max-w-xs">
            <label class="label" for="imageUrl">
              <span class="label-text">Photo de profil</span>
            </label>
            <input
              bind:value={$sessionUser.profile.imageUrl}
              disabled={$isLoading}
              type="text"
              placeholder="Tapez ici"
              class="input input-bordered w-full max-w-xs"
              name="first-name" />
          </div>
        </div>
      {/snippet}
      {#snippet button()}
        <button onclick={handleClick} class="btn btn-primary">Sauvegarder</button>
      {/snippet}
    </Panel>
    <Panel title="Préférences utilisateur">
      {#snippet panelContent()}        
        <p class="text-gray-500">
          Modifiez vos préférences d'utilisateur. N'oubliez pas de sauvegarder !
        </p>
        
        <div class="form-control w-full max-w-xs">
          <label class="label" for="theme">
            <span class="label-text">Thème</span>
          </label>
          <select
            bind:value={$sessionUser.preferences.theme}
            disabled={$isLoading}
            class="select select-bordered w-full max-w-xs"
            name="theme">
            <option value="emerald">Clair</option>
            <option value="dark">Foncé</option>
          </select>
        </div>
      {/snippet}
      {#snippet button()}
        <button onclick={handleClick} class="btn btn-primary">Sauvegarder</button>
      {/snippet}
    </Panel>
    {#if user && users.length > 0}
      <Panel title="DEV USER FEATURE">
        {#snippet panelContent()}        
          <p class="text-gray-500">
            Permet de se faire passer pour un autre utilisateur
          </p>
          
          <div class="form-control w-full max-w-xs">
            <label class="label" for="theme">
              <span class="label-text">Sélectionner un utilisateur</span>
            </label>
            <select
              bind:value={(user as UserType).preferences.devUser}
              disabled={$isLoading}
              class="select select-bordered w-full max-w-xs"
              name="devUser">
              {#each users as { email }}
                <option value={email}>{email}</option>
              {/each}
            </select>
          </div>
        {/snippet}
        {#snippet button()}
          <button onclick={submitdevUserUpdate} class="btn btn-primary">Sauvegarder</button>
        {/snippet}
      </Panel>
    {/if}
  </div>
{/if}
