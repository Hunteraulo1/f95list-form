<script lang="ts">
import Modal from './Modal.svelte';
import UserSelect from './UserSelect.svelte';

import { GAS_API } from '$lib/GAS_API';
import { fetchAppConfiguration } from '$lib/fetchAppConfig';
import { isLoading, newToast } from '$lib/stores';
import type { UserType } from '$types/schemas';

interface Props {
  showModal: boolean;
}

let { showModal = $bindable() }: Props = $props();

let selectedUsersFromChild: UserType[] = $state([]);

const handleNewAdminSubmit = async () => {
  let users = selectedUsersFromChild;

  $isLoading = true;

  for (let user of users) {
    console.info('raising user to admin status', user);

    const roles = new Set(user.roles);
    roles.add('admin');

    user = {
      ...user,
      roles: [...roles],
    };

    try {
      const result = await GAS_API.putUserRole({ user });

      if (typeof result === 'string') throw new Error('putUserRole no return');

      console.info('New admin added:', result);
      await fetchAppConfiguration();

      newToast({
        alertType: 'success',
        message: 'Nouveau Admin ajouté!',
      });
    } catch (error) {
      console.error('Could not add new admin:', error);
      newToast({
        alertType: 'error',
        message: "Erreur lors de l'ajout de l'Admin",
      });
    } finally {
      $isLoading = false;
    }
  }

  $isLoading = false;
};
</script>

<Modal bind:showModal title="Ajouter un administrateur">
  {#snippet modalContent()}
    <p class="py-4">Sélectionnez un utilisateur pour en faire un administrateur</p>
    <UserSelect selectedUsers={selectedUsersFromChild} />
  {/snippet}

  {#snippet modalAction()}
    <button
      onclick={handleNewAdminSubmit}
      disabled={selectedUsersFromChild.length === 0}
      class="btn">
      Ajouter
    </button>
  {/snippet}
</Modal>
