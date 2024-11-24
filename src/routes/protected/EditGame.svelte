<script lang="ts">
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';

import FormGame from '$components/FormGame.svelte';
import { GAS_API } from '$lib/GAS_API';
import { isLoading, queryGame } from '$lib/stores';
import type { GameType } from '$types/schemas';

let game: GameType | null = $state(null);

const fetchGame = async (): Promise<void> => {
  const query = $queryGame;

  if (!query) return navigate('/');

  console.info(`Fetching results for query: ${query.name} ${query.version}`);

  $isLoading = true;
  game = null;

  if (!query) return navigate('/');

  try {
    const result = await GAS_API.getGame(query);

    console.info(result);

    game = result;
  } catch (error) {
    console.error('Error fetching game', error);
  } finally {
    $isLoading = false;
  }
};

onMount(() => {
  fetchGame();
});
</script>

{#if game}
  <FormGame {game} step={5} edit />
{/if}
