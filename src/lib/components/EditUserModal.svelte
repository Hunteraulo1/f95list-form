<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast } from '$lib/stores';
import { checkUser } from '$lib/utils';
import { User } from '$types/schemas';
import Modal from './Modal.svelte';

import type { UserType } from '$types/schemas';

interface Props {
  showModal: boolean;
  user: UserType;
  users: UserType[];
}

let { showModal = $bindable(), user = $bindable(), users = $bindable() }: Props = $props();

let selectedRole = $state(user.role);

const handleEditUserSubmit = async (): Promise<void> => {
  $isLoading = true;

  try {
    const result = await GAS_API.putUserRole({ user, role: selectedRole });

    if (!result) {
      if (user.role === 'superAdmin' && !checkUser(['superAdmin'])) {
        newToast({
          alertType: 'error',
          message: "Vous n'avez pas les permissions pour modifier le rôle d'un superAdmin ou d'un admin.",
        });

        return;
      }

      newToast({
        alertType: 'error',
        message: "Vous n'avez pas les permissions suffisantes pour attribuer le rôle superAdmin ou admin.",
      });

      return;
    }

    users = users.map((u) => {
      if (u.email !== user.email) return u;

      return { ...u, role: selectedRole };
    });

    newToast({
      alertType: 'success',
      message: 'Rôle modifié!',
    });
  } catch (error) {
    console.error('Could not add new admin:', error);

    newToast({
      alertType: 'error',
      message: 'Erreur lors de la modification du rôle',
    });
  } finally {
    $isLoading = false;
  }
};
</script>

<Modal bind:showModal title="Modifier le rôle">
  {#snippet modalContent()}
    <select bind:value={selectedRole} class="select select-bordered w-full max-w-xs mt-4">
      {#each User.shape.role.options as role}
        <option value={role}>{role}</option>
      {/each}
    </select>
  {/snippet}

  {#snippet modalAction()}
    <button
      onclick={handleEditUserSubmit}
      class="btn">
      Modifier
    </button>
  {/snippet}
</Modal>
