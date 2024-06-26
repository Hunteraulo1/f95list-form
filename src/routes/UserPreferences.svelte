<script lang="ts">
import { createEventDispatcher } from 'svelte';
import { navigate } from 'svelte-routing';

import Panel from '$components/Panel.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, sessionUser } from '$lib/stores';
const dispatch = createEventDispatcher();

const handleClick = async () => {
  console.info('Button clicked!');

  if ($sessionUser) {
    await submitUserUpdate();
    $sessionUser.preferences?.theme &&
      document.querySelector('html')?.setAttribute('data-theme', $sessionUser.preferences.theme);
  }
};

const submitUserUpdate = async () => {
  $isLoading = true;

  console.info('submitting user update', $sessionUser);

  try {
    if (!$sessionUser) return navigate('/');

    const result = await GAS_API.putUser({ user: $sessionUser });

    console.info('result', result);
    dispatch('newToast', {
      id: Date.now(),
      alertType: 'success',
      message: "Mise à jour de l'utilisateur!",
      milliseconds: 3000,
    });
  } catch (error) {
    console.error('Error submitting user change', error);
    dispatch('newToast', {
      id: Date.now(),
      alertType: 'error',
      message: "Vos modifications n'ont pas pu être enregistrées",
      milliseconds: 3000,
    });
  } finally {
    $isLoading = false;
  }
};
</script>

{#if $sessionUser}
  <div>
    <Panel title="Informations de profil">
      <button on:click={handleClick} slot="button" class="btn btn-primary">Sauvegarder</button>
      <p class="text-gray-500" slot="description">
        Les informations contenues dans cette section sont affichées sur votre page de profil.
      </p>
      <div slot="panel-content" class="flex gap-8">
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
    </Panel>
    <Panel title="Préférences utilisateur">
      <button on:click={handleClick} slot="button" class="btn btn-primary">Sauvegarder</button>
      <p class="text-gray-500" slot="description">
        Modifiez vos préférences d'utilisateur. N'oubliez pas de sauvegarder !
      </p>
      <div slot="panel-content">
        <div class="form-control w-full max-w-xs">
          <label class="label" for="theme">
            <span class="label-text">Thème</span>
          </label>
          <select
            bind:value={$sessionUser.preferences.theme}
            disabled={$isLoading}
            class="select select-bordered w-full max-w-xs"
            name="theme">
            <option value="light">Clair</option>
            <option value="dark">Foncé</option>
          </select>
        </div>
      </div>
      <div class="card-actions justify-end"></div>
    </Panel>
  </div>
{/if}
