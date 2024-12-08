<script lang="ts">
import { isLoading } from '$lib/stores';
import type { Snippet } from 'svelte';

interface Props {
  title?: string;
  showDivider?: boolean;
  button?: Snippet;
  description?: Snippet;
  panelContent?: Snippet;
}

const { title, showDivider, button, description, panelContent }: Props = $props();
</script>

<div class="mt-8 w-full">
  <div class="flex justify-between">
    <h3 class="card-title">{title}</h3>
    {@render button?.()}
  </div>
  <div
    class="card mt-4 rounded-md border-2 border-base-300 bg-base-100 p-8 shadow-sm"
  >
    {#if $isLoading}
      <div
        class="absolute left-0 top-0 h-full w-full bg-base-300 opacity-50"
      ></div>
    {/if}
    <span class="text-base-200">
      {@render description?.()}
    </span>
    {#if showDivider}
      <div class="divider"></div>
    {/if}
    {@render panelContent?.()}
  </div>
</div>
