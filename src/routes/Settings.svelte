<script>
  import { createEventDispatcher } from 'svelte'
  import AddAdminModal from '../components/AddAdminModal.svelte'
  import Panel from '../components/Panel.svelte'
  import RemoveAdminModal from '../components/RemoveAdminModal.svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { sanitizeEmail } from '../lib/sanitizeEmail'
  import { appConfiguration, isLoading, sessionUser } from '../stores'
  const dispatch = createEventDispatcher()

  async function handleClick() {
    console.log('Button clicked!')
    await updateAppConfiguration($appConfiguration)
  }

  async function updateAppConfiguration(appConfiguration) {
    isLoading.set(true)

    console.log('submitting app configuration update', appConfiguration)

    GAS_API.putAppConfiguration({ appConfiguration })
      .then(result => {
        console.log('result', result)
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'success',
          message: "Configuration de l'application mise à jour !",
          milliseconds: 3000
        })
      })
      .catch(err => {
        console.error(
          "Erreur de transmission des changements de l'utilisateur",
          err
        )
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: "Vos modifications n'ont pas pu être enregistrées",
          milliseconds: 3000
        })
      })
      .finally(() => {
        isLoading.set(false)
      })
  }
</script>

<div>
  {#if $appConfiguration}
    <Panel title="General">
      <button slot="button" class="btn" on:click={handleClick}>
        Sauvegarder
      </button>
      <p class="text-gray-500" slot="description">
        Modifiez les paramètres de l'application. N'oubliez pas de sauvegarder !
      </p>
      <div slot="panel-content" class="w-full max-w-xs form-control">
        <label class="label" for="app-name">
          <span class="label-text">Nom de l'application</span>
        </label>
        <input
          bind:value={$appConfiguration.appName}
          disabled={$isLoading}
          type="text"
          placeholder="Type here"
          class="w-full max-w-xs input input-bordered"
          name="app-name"
        />
      </div>
    </Panel>

    <Panel title="Admins">
      <button
        slot="button"
        onclick="add_admin_modal.showModal()"
        disabled={!(
          $sessionUser.roles.includes('superAdmin') ||
          $sessionUser.roles.includes('admin')
        )}
        class="btn">Ajouter un administrateur</button
      >
      <p class="text-gray-500" slot="description">
        Ajouter des administrateurs au formulaire !
      </p>
      <div slot="panel-content">
        <div class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {#each $appConfiguration.admins as admin}
                <!-- row -->
                <tr>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar">
                        <div class="w-12 h-12 mask mask-squircle">
                          <img
                            src={admin.profile.imageUrl}
                            alt="Avatar Tailwind CSS Component"
                          />
                        </div>
                      </div>
                      <div>
                        <div class="font-bold">
                          {admin.email}
                        </div>
                        <div>
                          {#each admin.roles as role}
                            <span class="mr-2 badge badge-ghost badge-sm"
                              >{role}</span
                            >
                          {/each}
                        </div>
                      </div>
                    </div>
                  </td>
                  <th>
                    <button
                      onclick={`remove_admin_${sanitizeEmail(
                        admin.email
                      )}.showModal()`}
                      class="btn btn-ghost btn-xs">Supprimer</button
                    >
                    <RemoveAdminModal on:newToast user={admin} />
                  </th>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>

    <AddAdminModal on:newToast />
  {/if}
</div>
