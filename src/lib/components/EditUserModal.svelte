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

let newUser = $state(user);

const handleEditUserSubmit = async (): Promise<void> => {
  $isLoading = true;

  try {
    const result = await GAS_API.putUserRole({ user, role: newUser.role });

    if (!result && user.role !== newUser.role) {
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

    if (user.profile !== newUser.profile) {
      await GAS_API.putUser({ user: newUser });
    }

    users = users.map((u) => {
      if (u.email !== user.email) return u;

      return { ...u, newUser };
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

<Modal bind:showModal title="Modifier l'utilisateur">
  {#snippet modalContent()}
    <div class="flex flex-col gap-4 mt-4">
      <div class="flex flex-col max-w-xs">
        <label for="userName">Nom de l'utilisateur: </label>
        <input class="input input-bordered" name="userName" placeholder="Pseudo" value={newUser.profile.pseudo} />
      </div>
      
      <div class="flex flex-col max-w-xs">
        <label for="userName">Image de profile: </label>
        <input class="input input-bordered" name="userName" placeholder="Lien de l'image" value={newUser.profile.imageUrl} />
      </div>

      <div class="flex flex-col max-w-xs">
        <label for="userName">Rôle: </label>
        <select bind:value={newUser.role} class="select select-bordered">
          {#each User.shape.role.options as role}
            <option value={role}>{role}</option>
          {/each}
        </select>
      </div>
    </div>
  {/snippet}

  {#snippet modalAction()}
    <button
      onclick={handleEditUserSubmit}
      class="btn">
      Modifier
    </button>
  {/snippet}
</Modal>
