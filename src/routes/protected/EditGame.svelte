<script lang="ts">
import { onMount } from 'svelte'
import { navigate } from 'svelte-routing'

import FormGame from '$components/FormGame.svelte'
import { GAS_API } from '$lib/GAS_API'
import { isLoading, queryGame } from '$lib/stores'
import type { GameType } from '$types/schemas'

let game: GameType | null = null

const fetchGame = async () => {
  const query = $queryGame
  console.info(`Fetching results for query: ${query.name} ${query.version}`)

  $isLoading = true

  if (!query) return navigate('/')

  try {
    const result = await GAS_API.getGame(query)

    console.info(result)

    game = result
  } catch (error) {
    console.error('Error fetching game', error)
  } finally {
    $isLoading = false
  }
}

$: {
  // queryGame is a dependency and will trigger this code on change
  $queryGame

  fetchGame()
}

onMount(() => {
  fetchGame()
})
</script>

{#if game}
  <FormGame {game} step={5} edit on:newToast />
{/if}
