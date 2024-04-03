<script lang="ts">
  import Search from '../components/Search.svelte'
  import { GAS_API } from '../lib/GAS_API'
</script>

<button on:click={() => GAS_API.sendWebhook()}> Test WebHook </button>

<div class="flex flex-col items-center justify-center gap-4 mt-0">
  <Search />
</div>
