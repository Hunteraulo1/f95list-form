<script>
  import { createEventDispatcher } from 'svelte'
  import Panel from '../components/Panel.svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { isLoading } from '../stores'
  const dispatch = createEventDispatcher()

  /** @type {User | undefined} */
  export let user = undefined
  let { profile, preferences } = user || {
    profile: {
      pseudo: 'hi'
    },
    preferences: {
      theme: 'dark'
    }
  }

  async function handleClick() {
    console.log('Button clicked!')

    let result = await submitUserUpdate(user)
    document
      .querySelector('html')
      .setAttribute('data-theme', preferences?.theme)
  }

  async function submitUserUpdate(user) {
    isLoading.set(true)

    console.log('submitting user update', user)

    GAS_API.putUser({ user })
      .then(result => {
        console.log('result', result)
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'success',
          message: 'User updated!',
          milliseconds: 3000
        })
      })
      .catch(err => {
        console.error('Error submitting user change', err)
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: 'Your changes could not be saved',
          milliseconds: 3000
        })
      })
      .finally(() => {
        isLoading.set(false)
      })
  }
</script>

<div>
  <Panel title="Informations de profil">
    <button on:click={handleClick} slot="button" class="btn btn-primary"
      >Sauvegarder</button
    >
    <p class="text-gray-500" slot="description">
      Les informations contenues dans cette section sont affichées sur votre
      page de profil.
    </p>
    <div slot="panel-content">
      <div class="w-full max-w-xs form-control">
        <label class="label" for="first-name">
          <span class="label-text">Pseudo</span>
        </label>
        <input
          bind:value={profile.pseudo}
          disabled={$isLoading}
          type="text"
          placeholder="Tapez ici"
          class="w-full max-w-xs input input-bordered"
          name="first-name"
        />
      </div>
    </div>
  </Panel>
  <!-- {#if userPreferences} -->
  <Panel title="Préférences utilisateur">
    <button on:click={handleClick} slot="button" class="btn btn-primary"
      >Sauvegarder</button
    >
    <p class="text-gray-500" slot="description">
      Modifiez vos préférences d'utilisateur. N'oubliez pas de sauvegarder !
    </p>
    <div slot="panel-content">
      <div class="w-full max-w-xs form-control">
        <label class="label" for="theme">
          <span class="label-text">Thème</span>
        </label>
        <select
          bind:value={preferences.theme}
          disabled={$isLoading}
          type="text"
          class="w-full max-w-xs select select-bordered"
          name="theme"
        >
          <option value="light">Clair</option>
          <option value="dark">Foncé</option>
        </select>
      </div>
    </div>
    <div class="justify-end card-actions" />
  </Panel>
  <!-- {/if} -->
</div>
