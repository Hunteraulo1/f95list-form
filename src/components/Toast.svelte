<script lang="ts">
  import {
    ExclamationCircle,
    ExclamationTriangle,
    HandThumbUp,
    Icon,
    InformationCircle,
    XMark
  } from 'svelte-hero-icons'
  import { fade } from 'svelte/transition'

  let nodeRef: HTMLElement

  const removeToast = () => {
    nodeRef.parentNode?.removeChild(nodeRef)
  }

  export let alertType = '' // info, warning, success, error
  export let message = ''

  let alert = ''

  switch (alertType) {
    case 'info':
      alert = 'alert-info'
      break
    case 'warning':
      alert = 'alert-warning'
      break
    case 'success':
      alert = 'alert-success'
      break
    case 'error':
      alert = 'alert-error'
      break
  }
</script>

<div
  bind:this={nodeRef}
  in:fade={{ delay: 100, duration: 100 }}
  out:fade={{ duration: 100 }}
  class="block min-w-[200px] scale-100 transform px-3 py-2 transition-all duration-150 ease-out"
>
  <div class="alert {alert} bg-base shadow-lg">
    <div class="flex flex-row items-center">
      {#if alertType == 'info'}
        <Icon src={InformationCircle} size="1.5rem" />
      {:else if alertType == 'warning'}
        <Icon src={ExclamationTriangle} size="1.5rem" />
      {:else if alertType == 'success'}
        <Icon src={HandThumbUp} size="1.5rem" />
      {:else if alertType == 'error'}
        <Icon src={ExclamationCircle} size="1.5rem" />
      {/if}
    </div>
    <div>
      <div>{message}</div>
    </div>
    <div>
      <button
        class="btn btn-circle btn-neutral btn-sm opacity-60"
        on:click={removeToast}
      >
        <Icon src={XMark} />
      </button>
    </div>
  </div>
</div>
