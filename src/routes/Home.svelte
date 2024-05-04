<script lang="ts">
  import { userIsAdmin } from "$lib/stores";
  import Search from "../components/Search.svelte";
</script>

<div class="mt-0 flex flex-col items-center justify-center gap-4">
  {#if $userIsAdmin}
    <Search />
  {:else}
    <div class="h-screen">
      <h1>Vous n'êtes pas autorisé à utiliser cette application.</h1>
    </div>
  {/if}
</div>
