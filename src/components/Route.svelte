<script lang="ts">
import checkUser from '$lib/checkUser';
import type { UserType } from '$types/schemas';
import { Route, type Route as RouteType } from 'svelte-routing';
import PageNotFound from '../routes/error404.svelte';

interface Props {
  ranks?: UserType['roles'];
  children?: RouteType['$$slot_default'];
  path: RouteType['path'];
  component?: RouteType['component'];
}

let { path, ranks, component, children }: Props = $props();
</script>

<Route {path} {component}>
  {#if (!ranks || checkUser(ranks))}
    {@render children()}
  {:else}
    <PageNotFound />
  {/if}
</Route>
