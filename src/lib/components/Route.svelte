<script lang="ts">
import { checkUser } from '$lib/utils';
import { Route } from 'svelte-routing';
import PageNotFound from '../../routes/Error404.svelte';

import type { UserType } from '$types/schemas';
import type { Snippet } from 'svelte';
import type { Route as RouteType } from 'svelte-routing';

interface Props {
  ranks?: UserType['role'][];
  children?: Snippet;
  path: RouteType['path'];
  component?: RouteType['component'];
}

const { path, ranks, component, children }: Props = $props();
</script>

<Route {path} {component}>
  {#if (!ranks || checkUser(ranks))}
    {@render children?.()}
  {:else}
    <PageNotFound />
  {/if}
</Route>
