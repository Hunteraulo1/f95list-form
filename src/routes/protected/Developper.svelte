<script lang="ts">
import { newToast } from '$lib/stores';

import type { Toast } from '$types/index';

let selectToastValue = $state<Toast['alertType']>('warning');

const alertTypes: Toast['alertType'][] = ['error', 'info', 'success', 'warning'];
</script>

<div class="flex flex-col gap-2">
  <select class="select select-bordered sm:w-40" onchange={(e) => (selectToastValue = e.currentTarget.value as Toast['alertType'])}>
    {#each alertTypes as alertType}
      <option value={alertType}>{alertType}</option>
    {/each}
  </select>

  <button
    class="btn btn-primary sm:w-40"
    onclick={() =>
      newToast({
        alertType: selectToastValue,
        message: "Test du Dispatch",
        milliseconds: 60000,
      })}>
    Test Dispatch
  </button>
</div>
