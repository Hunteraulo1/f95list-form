<script lang="ts">
  import AddAdminModal from '$components/AddAdminModal.svelte'
  import Panel from '$components/Panel.svelte'
  import RemoveAdminModal from '$components/RemoveAdminModal.svelte'
  import { GAS_API } from '$lib/GAS_API'
  import { appConfiguration, isLoading, sessionUser } from '$lib/stores'
  import { createEventDispatcher } from 'svelte'
  import { Link } from 'svelte-routing'
  const dispatch = createEventDispatcher()

  const handleClick = async () => {
    if ($appConfiguration !== null) {
      await updateAppConfiguration()
    } else {
      console.error('App configuration is null.')
    }
  }

  const updateAppConfiguration = async () => {
    $isLoading = true

    console.info('submitting app configuration update', $appConfiguration)

    try {
      const result = GAS_API.putAppConfiguration({
        appConfiguration: $appConfiguration
      })

      console.info('result', result)
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: "Configuration de l'application mise à jour !",
        milliseconds: 3000
      })
    } catch (error) {
      console.error(
        "Erreur de transmission des changements de l'utilisateur",
        error
      )
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: "Vos modifications n'ont pas pu être enregistrées",
        milliseconds: 3000
      })
    } finally {
      $isLoading = false
    }
  }

  let dialogAdd: HTMLDialogElement
  let dialogRemove: HTMLDialogElement[] = []
</script>

<div>
  {#if $appConfiguration}
    <Panel title="General">
      <button slot="button" class="btn" on:click={handleClick}
        >Sauvegarder</button
      >
      <p class="text-gray-500" slot="description">
        Modifiez les paramètres de l'application. N'oubliez pas de sauvegarder !
      </p>
      <div slot="panel-content" class="form-control w-full max-w-xs">
        <label class="label" for="app-name">
          <span class="label-text">Nom de l'application</span>
        </label>
        <input
          bind:value={$appConfiguration.appName}
          disabled={$isLoading}
          type="text"
          placeholder="Type here"
          class="input input-bordered w-full max-w-xs"
          name="app-name"
        />
      </div>
    </Panel>

    <Panel title="Admins">
      <button
        slot="button"
        on:click={() => dialogAdd.showModal()}
        disabled={!(
          $sessionUser?.roles.includes('superAdmin') ||
          $sessionUser?.roles.includes('admin')
        )}
        class="btn"
      >
        Ajouter un administrateur
      </button>
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
              {#each $appConfiguration.admins as admin, index}
                <!-- row -->
                <tr>
                  <td>
                    <Link to="/user/{admin.email}">
                      <div class="flex items-center space-x-3">
                        <div class="avatar">
                          <div class="mask mask-squircle h-12 w-12">
                            <img
                              src={admin.profile?.imageUrl}
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
                              <span class="badge badge-ghost badge-sm mr-2"
                                >{role}</span
                              >
                            {/each}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </td>
                  <th>
                    <button
                      on:click={() => dialogRemove[index].showModal()}
                      class="btn btn-ghost btn-xs">Supprimer</button
                    >
                    <RemoveAdminModal
                      bind:dialog={dialogRemove[index]}
                      on:newToast
                      user={admin}
                    />
                  </th>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </Panel>

    <AddAdminModal bind:dialog={dialogAdd} on:newToast />
  {/if}
</div>
