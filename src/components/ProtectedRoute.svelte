<script>
  import { userIsAdmin, userIsSuperAdmin } from '$lib/stores'
  import { Route } from 'svelte-routing'
  import PageNotFound from '../routes/404.svelte'

  export let path
  export let superAdmin = false

  console.log({ superAdmin })
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
