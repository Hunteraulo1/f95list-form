<script lang="ts">
  import Edit from '../components/Edit.svelte'
  import Search from '../components/Search.svelte'
  import { queryGame } from '../stores'

  queryGame.set({
    name: 'test',
    version: ''
  })
</script>

<div class="flex flex-col items-center justify-center gap-4 mt-0">
  <Search />
  {#if $queryGame.name}
    <Edit />
  {/if}
</div>
