<script lang="ts">
import { createEventDispatcher } from 'svelte';

import Modal from './Modal.svelte';
import UserSelect from './UserSelect.svelte';

import { GAS_API } from '$lib/GAS_API';
import { fetchAppConfiguration } from '$lib/fetchAppConfig';
import { isLoading } from '$lib/stores';
import type { UserType } from '$types/schemas';

const dispatch = createEventDispatcher();

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

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: 'Nouveau Admin ajouté!',
        milliseconds: 3000,
      });
    } catch (error) {
      console.error('Could not add new admin:', error);
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: "Erreur lors de l'ajout de l'Admin",
        milliseconds: 3000,
      });
    } finally {
      $isLoading = false;
    }
  }

  $isLoading = false;
};

  interface Props {
    showModal: boolean;
  }

  let { showModal = $bindable() }: Props = $props();
</script>

<Modal bind:showModal title="Ajouter un administrateur">
  <!-- @migration-task: migrate this slot by hand, `modal-content` is an invalid identifier -->
  <div slot="modal-content">
    <p class="py-4">Sélectionnez un utilisateur pour en faire un administrateur</p>
    <UserSelect
      on:update={(e) => {
        selectedUsersFromChild = e.detail;
      }} />
  </div>

  <!-- @migration-task: migrate this slot by hand, `modal-action` is an invalid identifier -->
  <button
    slot="modal-action"
    onclick={handleNewAdminSubmit}
    disabled={selectedUsersFromChild.length === 0}
    class="btn">
    Ajouter
  </button>
</Modal>
