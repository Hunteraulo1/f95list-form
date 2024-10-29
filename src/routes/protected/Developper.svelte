<script lang="ts">
import { createEventDispatcher } from 'svelte';

import type { Toast } from '$types/index';

const dispatch = createEventDispatcher();

let selectToastValue: typeof alertTypes | string = $state('warning');

const alertTypes: Toast['alertType'][] = ['error', 'info', 'success', 'warning'];
</script>

<div class="flex flex-col gap-2">
  <select class="select select-bordered sm:w-40" onchange={(e) => (selectToastValue = e.currentTarget.value)}>
    {#each alertTypes as alertType}
      <option value={alertType}>{alertType}</option>
    {/each}
  </select>

  <button
    class="btn btn-primary sm:w-40"
    onclick={() =>
      dispatch("newToast", {
        id: Date.now(),
        alertType: selectToastValue,
        message: "Test du Dispatch",
        milliseconds: 60000,
      })}>
    Test Dispatch
  </button>

  <h1>test</h1>
</div>
