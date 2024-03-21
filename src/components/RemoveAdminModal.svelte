<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { fetchAppConfiguration } from '../lib/fetchAppConfig'
  import { isLoading } from '../stores'
  import type { UserType } from '../types/schemas'
  import Modal from './Modal.svelte'
  const dispatch = createEventDispatcher()

  export let user: UserType

  function handleAdminRemovalSubmit() {
    // TODO: validate input
    console.log('removing admin status from user', user)

    isLoading.set(true)

    // remove any instances of the admin role from users.roles
    user.roles = user.roles.filter(role => role !== 'admin')

    GAS_API.putUser({ user })
      .then(async result => {
        console.log('Admin removed:', result)
        await fetchAppConfiguration()

        dispatch('newToast', {
          id: Date.now(),
          alertType: 'success',
          message: 'Admin removed!',
          milliseconds: 3000
        })
      })
      .catch(err => {
        console.error('Could not remove admin:', err)
        dispatch('newToast', {
          id: Date.now(),
          alertType: 'error',
          message: 'Your changes could not be saved',
          milliseconds: 3000
        })
      })
      .finally(() => {
        isLoading.set(false)
      })
  }

  export let dialog: HTMLDialogElement
</script>

<Modal bind:dialog title="Remove Admin">
  <div slot="modal-content">
    <p class="py-4">
      Are you sure you want to remove this user's admin privileges
    </p>
    <div
      class="flex items-center space-x-3 p-2 my-2 hover:bg-base-200 hover:cursor-pointer"
    >
      <div class="flex justify-center items-center space-x-3">
        <div class="mask mask-squircle w-12 h-12">
          <img src={user.profile.imageUrl} alt="User" />
        </div>
        <div>
          <div class="font-bold">{user.email}</div>
        </div>
      </div>
    </div>
  </div>
  <button
    slot="modal-action"
    on:click={handleAdminRemovalSubmit}
    disabled={!user}
    class="btn">Confirm</button
  >
</Modal>
