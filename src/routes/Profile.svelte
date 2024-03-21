<script lang="ts">
  import Panel from '../components/Panel.svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { isLoading } from '../stores'
  //import { UserType } from '../types/schemas'

  /** @type {string} id - comes from URL params */
  export let email: string

  /** @type {boolean} */
  let loading = false

  /** @type {User | undefined} */
  let user: any | undefined = undefined

  // Fetch the user on mount
  $: fetchUser(email)

  /**
   * Fetches the requested user from the server.
   * @param {string} email
   */
  const fetchUser = async (email: string) => {
    isLoading.set(true)

    console.log('fetching user data for profile...')

    GAS_API.getUser({ email })
      .then(result => {
        user = result
        console.log('User data:', user)
      })
      .catch(err => {
        console.error('Could not get user data:', err)
      })
      .finally(() => {
        console.log('User data loaded.')
        isLoading.set(false)
      })
  }
</script>

{#if user && !loading}
  <div class="flex flex-row">
    <div class="flex flex-col px-12 py-2">
      <div class="mb-4 avatar">
        <div
          class="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1"
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
    <div class="flex flex-col items-center flex-grow">
      <div class="w-full shadow stats">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-8 h-8 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              /></svg
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
