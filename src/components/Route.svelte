<script lang="ts">
import { sessionUser, userIsSuperAdmin } from '$lib/stores';
import type { UserType } from '$types/schemas';
import { Route, type Route as RouteType } from 'svelte-routing';
import PageNotFound from '../routes/error404.svelte';

interface Props {
  rank?: UserType['roles'][0];
  children?: RouteType['$$slot_default'];
  path: RouteType['path'];
  component?: RouteType['component'];
}

let { path, rank, component, children }: Props = $props();
</script>

<Route {path} {component}>
  {#if (!rank || $sessionUser?.roles.includes(rank) || $userIsSuperAdmin)}
    {@render children()}
  {:else}
    <PageNotFound />
  {/if}
</Route>
