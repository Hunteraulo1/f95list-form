<script lang="ts">
import FormGame from '$components/FormGame.svelte';
import { GAS_API } from '$lib/GAS_API';
import { game, isLoading, queryGame } from '$lib/stores';
import { navigate } from 'svelte-routing';

import type { QueryGameType } from '$types/schemas';

const fetchGame = async (query: QueryGameType): Promise<void> => {
  console.info(`Fetching results for query: ${query.name} ${query.version}`);

  $isLoading = true;

  try {
    const result = await GAS_API.getGame(query);

    console.info(result);

    $game = result;
  } catch (error) {
    console.error('Error fetching game', error);
  } finally {
    $isLoading = false;
  }
};

$effect(() => {
  if (!$queryGame) return navigate('/');

  fetchGame($queryGame);
});
</script>

{#if $game}
  <FormGame step={5} edit />
{/if}
