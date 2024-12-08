<script lang="ts">
import { toasts } from '$lib/stores';
import { ExclamationCircle, ExclamationTriangle, HandThumbUp, Icon, InformationCircle, XMark } from 'svelte-hero-icons';
import { fade } from 'svelte/transition';

import type { Toast } from '$types/index';

interface Props {
  toast: Toast;
}

const { toast }: Props = $props();
const { alertType, message, id, milliseconds } = toast;

const handleRemove = (): void => {
  toasts.update((currentToasts) => currentToasts.filter((t) => t.id !== id));
};

const alertClass = (): string => {
  switch (alertType) {
    case 'info':
      return 'alert-info';
    case 'warning':
      return 'alert-warning';
    case 'success':
      return 'alert-success';
    case 'error':
      return 'alert-error';
  }
};
</script>

<div
  in:fade={{ delay: 100, duration: 100 }}
  out:fade={{ duration: 100 }}
  class="block min-w-[200px] scale-100 transform px-3 py-2 transition-all duration-[{milliseconds}ms] ease-out">
  <div class="alert {alertClass()} bg-base shadow-lg">
    <div class="flex flex-row items-center">
      {#if alertType == "info"}
        <Icon src={InformationCircle} size="1.5rem" />
      {:else if alertType == "warning"}
        <Icon src={ExclamationTriangle} size="1.5rem" />
      {:else if alertType == "success"}
        <Icon src={HandThumbUp} size="1.5rem" />
      {:else if alertType == "error"}
        <Icon src={ExclamationCircle} size="1.5rem" />
      {/if}
    </div>
    <div>
      <div>{message}</div>
    </div>
    <div>
      <button class="btn btn-circle btn-neutral btn-sm opacity-60" onclick={handleRemove}>
        <Icon src={XMark} />
      </button>
    </div>
  </div>
</div>
