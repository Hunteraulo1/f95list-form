<script lang="ts">
import { isLoading } from '$lib/stores';

export let title = '';
export let showDivider = true;
</script>

<div class="mt-8 w-full">
  <div class="flex justify-between">
    <h3 class="card-title">{title}</h3>
    <slot name="button" />
  </div>
  <div
    class="card mt-4 rounded-md border-2 border-base-300 bg-base-100 p-8 shadow-sm"
  >
    {#if $isLoading}
      <div
        class="absolute left-0 top-0 h-full w-full bg-base-300 opacity-50"
      ></div>
    {/if}
    <slot class="text-base-200" name="description" />
    {#if showDivider}
      <div class="divider"></div>
    {/if}
    <slot name="panel-content" />
  </div>
</div>
