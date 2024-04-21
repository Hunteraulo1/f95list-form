<script lang="ts">
  import { GAS_API } from '$lib/GAS_API'
  import { userIsSuperAdmin } from '$lib/stores'
  import { createEventDispatcher } from 'svelte'
  import Search from '../components/Search.svelte'

  const dispatch = createEventDispatcher()
</script>

{#if $userIsSuperAdmin}
  <button
    on:click={() => GAS_API.sendWebhook(false)}
    class="btn btn-primary sm:w-40"
  >
    Test WebHook
  </button>

  <button
    class="btn btn-primary sm:w-40"
    on:click={() =>
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: 'Test du Dispatch',
        milliseconds: 60000
      })}
  >
    Test Dispatch
  </button>
{/if}

<div class="mt-0 flex flex-col items-center justify-center gap-4">
  <Search />
</div>
