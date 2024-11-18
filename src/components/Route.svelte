<script lang="ts">
import type { UserType } from '$types/schemas';
import { Route, type Route as RouteType } from 'svelte-routing';
import PageNotFound from '../routes/error404.svelte';
import checkUser from '../server/lib/checkUser';

interface Props {
  rank?: UserType['roles'][0];
  children?: RouteType['$$slot_default'];
  path: RouteType['path'];
  component?: RouteType['component'];
}

let { path, rank, component, children }: Props = $props();
</script>

<Route {path} {component}>
  {#if (!rank || checkUser(rank))}
    {@render children()}
  {:else}
    <PageNotFound />
  {/if}
</Route>
