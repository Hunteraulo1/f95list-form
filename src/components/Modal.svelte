<script lang="ts">
  export let title: string = ""
  export let dialog: unknown
</script>

<dialog bind:this={dialog} class="modal modal-bottom sm:modal-middle">
  <form method="dialog" class="modal-box">
    <button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"> ✕ </button>
    <h3 class="text-lg font-bold">{title}</h3>
    <slot name="modal-content" />
    <div class="modal-action">
      <!-- if there is a button in form, it will close the modal -->
      <slot name="modal-action" />
    </div>
  </form>

  <form method="dialog" class="modal-backdrop">
    <button>Fermer</button>
  </form>
</dialog>
