<script lang="ts">
import Submits from '$components/Submits.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, newToast, sessionUser } from '$lib/stores';
import type { SubmitType, UserType } from '$types/schemas';
import { onMount } from 'svelte';

let submits: SubmitType[] = $state([]);
let users: UserType[] = $state([]);

onMount(async () => {
  if (!$sessionUser) return;
  $isLoading = true;

  try {
    submits = await GAS_API.getSubmits({ user: $sessionUser });

    const user = await GAS_API.getUser();

    users.push(user);
  } catch (error) {
    console.error(error);

    newToast({
      message: 'Une erreur est survenue lors de la récupération des soumissions',
      alertType: 'error',
    });
  } finally {
    $isLoading = false;
  }

  console.info('submits', submits);
});
</script>

<Submits {submits} {users} />
