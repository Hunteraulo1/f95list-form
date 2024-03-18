<script lang="ts">
  import { Route } from 'svelte-routing'
  import PageNotFound from '../routes/404.svelte'
  import { userIsAdmin } from '../stores'

  export let path: string
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
