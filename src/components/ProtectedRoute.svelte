<script>
  import { Route } from 'svelte-routing';
  import PageNotFound from '../routes/404.svelte';
  import { userIsAdmin } from '$lib/stores';

  export let path;
</script>

{#if $userIsAdmin}
  <Route {path}>
    <slot />
  </Route>
{:else}
  <Route {path}>
    <PageNotFound />
  </Route>
{/if}
