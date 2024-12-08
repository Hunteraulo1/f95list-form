<script lang="ts">
import { toasts } from '$lib/stores';
import Toast from './Toast.svelte';
</script>

<div id="toaster" class="fixed bottom-4 left-2 z-50 mx-0 my-auto">
  {#each $toasts as toast (toast.id)}
    <Toast {toast} />
  {/each}
</div>
