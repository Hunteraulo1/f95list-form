
<script lang="ts">
export let title = '';
export let showModal: boolean;

let dialog: HTMLDialogElement;

$: if (dialog && showModal) {
  dialog.showModal();
  console.log({ dialog });
}
</script>

{#if showModal}
  <dialog bind:this={dialog} class="modal modal-bottom sm:modal-middle">
    <form method="dialog" class="modal-box">
      <button
        class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
        onclick={() => {showModal = false}}>
        ✕
      </button>
      <h3 class="text-lg font-bold">{title}</h3>
      <slot name="modalContent" />
      <div class="modalAction">
        <!-- if there is a button in form, it will close the modal -->
        <slot name="modalAction" />
      </div>
    </form>

    <form method="dialog" class="modal-backdrop">
      <button onclick={() => {showModal = false}}>Fermer</button>
    </form>
  </dialog>
{/if}
