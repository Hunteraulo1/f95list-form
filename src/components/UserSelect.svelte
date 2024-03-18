<script lang="ts">
  import { debounce } from 'lodash'
  import { createEventDispatcher } from 'svelte'
  import { GAS_API } from '../lib/GAS_API'
  import type { UserType } from '../types/schemas'
  import LoadingSpinner from './LoadingSpinner.svelte'

  const dispatch = createEventDispatcher()

  let searchQuery = ''
  let searching = false
  let searchCount = 0
  let searchResults: UserType[] = []
  let selectedUsers: UserType[] = []

  const fetchResults = debounce(async (query: string) => {
    selectedUsers = []
    dispatch('update', selectedUsers)

    // Simulating a server request
    console.log(`Fetching results for query: ${query}`)
    searching = true

    GAS_API.getUser({ email: searchQuery })
      .then(result => {
        console.log({ result })

        if (result) {
          searchResults = [result]
        } else {
          searchResults = []
        }
      })
      .catch(err => {
        console.error('Error fetching user', err)
      })
      .finally(() => {
        searchCount = searchCount + 1
        searching = false
      })
  }, 1000)

  function toggleSelect(user: UserType) {
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
          class="flex items-center space-x-3 p-2 my-2 hover:bg-base-200 hover:cursor-pointer"
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
          <div class="flex justify-center items-center space-x-3">
            <div class="mask mask-squircle w-12 h-12">
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

<style>
  .selected {
    background-color: hsl(var(--s));
  }
</style>
