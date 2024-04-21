<script lang="ts">
  import { GAS_API } from '$lib/GAS_API'
  import type { UserType } from '$types/schemas'
  import { createEventDispatcher } from 'svelte'
  import LoadingSpinner from './LoadingSpinner.svelte'

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let searching = false
  let searchCount = 0
  let searchResults: UserType[] = []
  let selectedUsers: UserType[] = []

  let debounceTimeout: NodeJS.Timeout | null = null

  const fetchResults = (query: string) => {
    selectedUsers = []
    dispatch('update', selectedUsers)

    // Simulating a server request
    console.info(`Fetching results for query: ${query}`)
    searching = true

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }

    debounceTimeout = setTimeout(async () => {
      try {
        const result = await GAS_API.getUser({ email: searchQuery })

        console.info({ result })

        if (result) {
          searchResults = [result]
        } else {
          searchResults = []
        }
      } catch (error) {
        console.error('Error fetching user', error)
      } finally {
        searchCount = searchCount + 1
        searching = false
      }
    }, 1000)
  }

  const toggleSelect = (user: UserType) => {
    const index = selectedUsers.findIndex(
      selected => selected.email === user.email
    )

    if (index > -1) {
      selectedUsers.splice(index, 1)
      selectedUsers = [...selectedUsers]
    } else {
      selectedUsers.push(user)
      selectedUsers = [...selectedUsers]
    }

    // Notify the parent component
    dispatch('update', selectedUsers)
  }

  const handleSearchInput = (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    searchQuery = event.currentTarget.value
    fetchResults(searchQuery)
  }
</script>

<div>
  <div class="flex">
    <input
      type="text"
      placeholder="Search..."
      bind:value={searchQuery}
      on:input={handleSearchInput}
      class="input input-bordered w-full max-w-xs"
    />
    <div class="pl-2">
      {#if searching}
        <LoadingSpinner />
      {/if}
    </div>
  </div>

  <div class="pt-4">
    {#if searchResults.length > 0}
      {#each searchResults as userResult}
        <div
          class="my-2 flex items-center space-x-3 p-2 hover:cursor-pointer hover:bg-base-200"
          on:click={() => toggleSelect(userResult)}
          on:keypress={event => {
            if (event.key === 'Enter' || event.key === ' ') {
              toggleSelect(userResult)
            }
          }}
          role="button"
          tabindex="0"
          class:selected={selectedUsers.some(
            selected => selected.email === userResult.email
          )}
        >
          <div class="flex items-center justify-center space-x-3">
            <div class="mask mask-squircle h-12 w-12">
              <img src={userResult.profile?.imageUrl} alt="User" />
            </div>
            <div>
              <div class="font-bold">{userResult.email}</div>
            </div>
          </div>
        </div>
      {/each}
    {:else if searchCount > 0}
      <div>No results</div>
    {/if}
  </div>
</div>

<style lang="postcss">
  .selected {
    background-color: hsl(var(--s));
  }
</style>
