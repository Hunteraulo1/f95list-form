<script lang="ts">
import { Route } from 'svelte-routing';

import PageNotFound from '../routes/error404.svelte';

import { userIsAdmin, userIsSuperAdmin } from '$lib/stores';

interface Props {
  path: string;
  superAdmin?: boolean;
  children?: import('svelte').Snippet;
}

let { path, superAdmin = false, children }: Props = $props();

console.log({ superAdmin });
</script>

{#if ($userIsAdmin && !superAdmin) || $userIsSuperAdmin}
  <Route {path}>
    {@render children?.()}
  </Route>
{:else}
  <Route {path}>
    <PageNotFound />
  </Route>
{/if}
