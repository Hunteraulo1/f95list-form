<script lang="ts">
import Search from '../components/Search.svelte';

import checkUser from '$lib/checkUser';
</script>

<div class="mt-0 flex flex-col items-center justify-center gap-4">
  {#if checkUser(['traductor', 'admin'])}
    <Search />
  {:else}
    <div class="h-screen">
      <h1>Vous n'êtes pas autorisé à utiliser cette application.</h1>
    </div>
  {/if}
</div>
