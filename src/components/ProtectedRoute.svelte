<script lang="ts">
import { Route } from 'svelte-routing';

import PageNotFound from '../routes/error404.svelte';

import { userIsAdmin, userIsSuperAdmin } from '$lib/stores';

export let path: string;
export let superAdmin = false;

console.log({ superAdmin });
</script>

{#if ($userIsAdmin && !superAdmin) || $userIsSuperAdmin}
  <Route {path}>
    <slot />
  </Route>
{:else}
  <Route {path}>
    <PageNotFound />
  </Route>
{/if}
