<script lang="ts">
import Submits from '$components/Submits.svelte';
import { GAS_API } from '$lib/GAS_API';
import { sessionUser } from '$lib/stores';
import type { SubmitType, UserType } from '$types/schemas';
import { onMount } from 'svelte';

let submits: SubmitType[] = $state([]);
let users: UserType[] = $state([]);

onMount(async () => {
  if (!$sessionUser) return;

  submits = await GAS_API.getSubmits({});
  console.log('🚀 ~ onMount ~ submits:', submits);

  users = await GAS_API.getUsers();
  console.log('🚀 ~ onMount ~ users:', users);
});
</script>

{#if submits && users}
  <Submits bind:submits={submits} {users} editable />
{/if}
