<script lang="ts">
import Toast from './Toast.svelte';

import type { Toast as ToastType } from '$types/index';

  interface Props {
    toasts?: ToastType[];
  }

  let { toasts = [] }: Props = $props();
</script>

<div id="toaster" class="fixed bottom-4 left-2 z-50 mx-0 my-auto">
  {#each toasts as toast (toast.id)}
    <Toast alertType={toast.alertType} message={toast.message} />
  {/each}
</div>
