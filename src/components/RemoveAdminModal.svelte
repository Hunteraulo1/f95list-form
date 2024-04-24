<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Modal from "./Modal.svelte";

  import { fetchAppConfiguration } from "$lib/fetchAppConfig";
  import { GAS_API } from "$lib/GAS_API";
  import { isLoading } from "$lib/stores";
  import type { UserType } from "$types/schemas";

  const dispatch = createEventDispatcher();

  export let user: UserType;

  const handleAdminRemovalSubmit = async () => {
    console.info("removing admin status from user", user);

    $isLoading = true;

    const roles: UserType["roles"] = ["admin"];
    // remove any instances of the admin role from users.roles
    user.roles = user.roles.filter((role) => !roles.includes(role));

    try {
      const result = await GAS_API.putUser({ user });

      console.info("Admin removed:", result);

      await fetchAppConfiguration();

      dispatch("newToast", {
        id: Date.now(),
        alertType: "success",
        message: "Admin supprimé!",
        milliseconds: 3000,
      });
    } catch (error) {
      console.error("Could not remove admin:", error);

      dispatch("newToast", {
        id: Date.now(),
        alertType: "error",
        message: "Vos modifications n'ont pas pu être enregistrées",
        milliseconds: 3000,
      });
    } finally {
      $isLoading = false;
    }
  };

  export let dialog: HTMLDialogElement;
</script>

<Modal bind:dialog title="Remove Admin">
  <div slot="modal-content">
    <p class="py-4">Êtes-vous sûr de vouloir supprimer les privilèges d'administrateur de cet utilisateur ?</p>
    <div class="my-2 flex items-center space-x-3 p-2 hover:cursor-pointer hover:bg-base-200">
      <div class="flex items-center justify-center space-x-3">
        <div class="mask mask-squircle h-12 w-12">
          <img src={user.profile.imageUrl} alt="User" />
        </div>
        <div>
          <div class="font-bold">{user.email}</div>
        </div>
      </div>
    </div>
  </div>
  <button slot="modal-action" on:click={handleAdminRemovalSubmit} disabled={!user} class="btn">Confirmer</button>
</Modal>
