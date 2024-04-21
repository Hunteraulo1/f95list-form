<script lang="ts">
  import Panel from '$components/Panel.svelte'
  import { GAS_API } from '$lib/GAS_API'
  import { isLoading } from '$lib/stores'
  import type { UserType } from '$types/schemas'
  import { createEventDispatcher } from 'svelte'

  export let email: string

  const dispatch = createEventDispatcher()

  let loading = false

  let user: UserType | undefined = undefined

  // Fetch the user on mount
  $: fetchUser(email)

  const fetchUser = async (email: string) => {
    $isLoading = true

    console.info('fetching user data for profile...')

    try {
      const result = await GAS_API.getUser({ email })

      if (typeof result === 'string') throw new Error('getUser no result')

      user = result
      console.info('User data:', user)
    } catch (error) {
      console.error('Could not get user data:', error)

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: 'Impossible de récupérer les information utilisateur',
        milliseconds: 3000
      })
    } finally {
      console.info('User data loaded.')

      $isLoading = false
    }
  }
</script>

{#if user && !loading}
  <div class="flex flex-row">
    <div class="flex flex-col px-12 py-2">
      <div class="avatar mb-4">
        <div
          class="w-32 rounded-full ring ring-primary ring-offset-1 ring-offset-base-100"
        >
          <img src={user.profile.imageUrl} alt="The user" />
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-8 w-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path></svg
            >
          </div>
          <div class="stat-title">Total de jeu ajouté</div>
          <div class="stat-value text-primary">25</div>
          <div class="stat-desc">Fonctionnalité à venir</div>
        </div>

        <div class="stat">
          <!-- <div class="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              /></svg
            >
          </div> -->
          <div class="stat-title">Total de jeu modifié</div>
          <div class="stat-value text-secondary">263</div>
          <div class="stat-desc">Fonctionnalité à venir</div>
        </div>
      </div>
      <Panel title="Recent Activity">
        <div slot="panel-content" class="overflow-x-auto">
          <table class="table">
            <!-- head -->
            <thead>
              <tr>
                <th> Label </th>
                <th> Value </th>
              </tr>
            </thead>
            <tbody>
              {#each user.activity as record}
                <tr>
                  <td>{record.label}</td>
                  <td
                    >{new Date(record.value).toLocaleDateString('fr-FR', {
                      hour: 'numeric',
                      minute: 'numeric'
                    })}</td
                  >
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  </div>
{/if}
