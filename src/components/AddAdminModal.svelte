<script lang="ts">
  import { createEventDispatcher } from "svelte"

  import Modal from "./Modal.svelte"
  import UserSelect from "./UserSelect.svelte"

  import { fetchAppConfiguration } from "$lib/fetchAppConfig"
  import { GAS_API } from "$lib/GAS_API"
  import { isLoading } from "$lib/stores"
  import type { UserType } from "$types/schemas"

  const dispatch = createEventDispatcher()

  let selectedUsersFromChild: UserType[] = []

  const handleNewAdminSubmit = async () => {
    let user = selectedUsersFromChild[0]
    console.info("raising user to admin status", user)

    $isLoading = true

    const roles = new Set(user.roles)
    roles.add("admin")

    user = {
      ...user,
      roles: [...roles],
    }

    try {
      const result = await GAS_API.putUser({ user })

      if (typeof result === "string") throw new Error("putUser no return")

      console.info("New admin added:", result)
      await fetchAppConfiguration()

      dispatch("newToast", {
        id: Date.now(),
        alertType: "success",
        message: "Admin ajouté!",
        milliseconds: 3000,
      })
    } catch (error) {
      console.error("Could not add new admin:", error)
      dispatch("newToast", {
        id: Date.now(),
        alertType: "error",
        message: "Vos modifications n'ont pas pu être enregistrées",
        milliseconds: 3000,
      })
    } finally {
      $isLoading = false
    }
  }

  export let dialog: HTMLDialogElement
</script>

<Modal bind:dialog title="Add Admin">
  <div slot="modal-content">
    <p class="py-4">Sélectionnez un utilisateur pour en faire un administrateur</p>
    <UserSelect
      on:update={(e) => {
        selectedUsersFromChild = e.detail
      }} />
  </div>

  <button
    slot="modal-action"
    on:click={handleNewAdminSubmit}
    disabled={selectedUsersFromChild.length === 0}
    class="btn">
    Envoyer
  </button>
</Modal>
