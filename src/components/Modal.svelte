<script lang="ts">
import type { Snippet } from 'svelte';

interface Props {
  title: string;
  showModal: boolean;
  modalContent: Snippet;
  modalAction: Snippet;
  bigger?: boolean;
}

let { title = '', showModal = $bindable(), modalContent, modalAction, bigger }: Props = $props();
let dialog = $state<HTMLDialogElement>();

$effect(() => {
  if (showModal) dialog?.showModal();
});
</script>

{#if showModal}
  <dialog
    bind:this={dialog}
    onclose={() => (showModal = false)}
    class="modal modal-bottom sm:modal-middle">
    <form method="dialog" class="modal-box" class:!max-w-4xl={bigger}>
      <button
      class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
      onclick={() => dialog?.close()}
      onkeydown={(e) => {e.key === 'Escape' && dialog?.close()}}>
      ✕
    </button>
    <h3 class="text-lg font-bold">{title}</h3>
    {@render modalContent?.()}
    <div class="modal-action">
      <!-- if there is a button in form, it will close the modal -->
        {@render modalAction?.()}
      </div>
    </form>

    <form method="dialog" class="modal-backdrop">
      <button onclick={() => dialog?.close()}
        onkeydown={(e) => {e.key === 'Escape' && dialog?.close()}}>
        Fermer
      </button>
    </form>
  </dialog>
{/if}
