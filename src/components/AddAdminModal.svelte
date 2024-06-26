<script lang="ts">
import { createEventDispatcher } from 'svelte'

import Modal from './Modal.svelte'
import UserSelect from './UserSelect.svelte'

import { GAS_API } from '$lib/GAS_API'
import { fetchAppConfiguration } from '$lib/fetchAppConfig'
import { isLoading } from '$lib/stores'
import type { UserType } from '$types/schemas'

const dispatch = createEventDispatcher()

let selectedUsersFromChild: UserType[] = []

const handleNewAdminSubmit = async () => {
  let users = selectedUsersFromChild

  $isLoading = true

  users.forEach(async (user) => {
    console.info('raising user to admin status', user)

    const roles = new Set(user.roles)
    roles.add('admin')

    user = {
      ...user,
      roles: [...roles],
    }

    try {
      const result = await GAS_API.putUserRole({ user })

      if (typeof result === 'string') throw new Error('putUserRole no return')

      console.info('New admin added:', result)
      await fetchAppConfiguration()

      dispatch('newToast', {
        id: Date.now(),
        alertType: 'success',
        message: 'Nouveau Admin ajouté!',
        milliseconds: 3000,
      })
    } catch (error) {
      console.error('Could not add new admin:', error)
      dispatch('newToast', {
        id: Date.now(),
        alertType: 'error',
        message: "Erreur lors de l'ajout de l'Admin",
        milliseconds: 3000,
      })
    } finally {
      $isLoading = false
    }
  })

  $isLoading = false
}

export let showModal: boolean
</script>

<Modal bind:showModal title="Ajouter un administrateur">
  <div slot="modal-content">
    <p class="py-4">Sélectionnez un utilisateur pour en faire un administrateur</p>
    <UserSelect
      on:update={(e) => {
        selectedUsersFromChild = e.detail;
      }} />
  </div>

  <button
    slot="modal-action"
    on:click={handleNewAdminSubmit}
    disabled={selectedUsersFromChild.length === 0}
    class="btn">
    Ajouter
  </button>
</Modal>
