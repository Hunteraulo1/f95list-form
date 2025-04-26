<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { newToast } from '$lib/stores';

import type { Toast } from '$types/index';

let selectToastValue = $state<Toast['alertType']>('warning');

const alertTypes: Toast['alertType'][] = ['error', 'info', 'success', 'warning'];

let id: number = $state(0);

const handleClickScrape = async (): Promise<void> => {
  try {
    const response = await GAS_API.getScrape({ domain: 'F95z', id });

    console.info(response);
  } catch (error) {
    console.error(error);
  }
};
</script>

<div class="flex flex-col gap-2">
  <div class="flex">
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

  <div class="flex">
    <input type="number" value={id} oninput={(e)=> id = Number.parseInt(e.currentTarget.value)} />
    <button
      class="btn btn-primary sm:w-40"
      onclick={handleClickScrape}>
      Valider
    </button>
  </div>
</div>
