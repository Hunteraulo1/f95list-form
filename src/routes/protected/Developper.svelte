<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher()
</script>

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
