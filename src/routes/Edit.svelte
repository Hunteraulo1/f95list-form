<script lang="ts">
  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import FormGame from '../components/FormGame.svelte'
  import { GAS_API } from '../lib/GAS_API'
  import { isLoading, queryGame } from '../stores'
  import type { Game } from '../types/types'

  let game: Game | null = null

  const fetchGame = () => {
    const query = $queryGame
    console.log(`Fetching results for query: ${query.name} ${query.version}`)

    isLoading.set(true)

    if (query) {
      GAS_API.getGame(query)
        .then(result => {
          if (result) {
            game = result
            console.log(result)
          }
        })
        .catch(err => {
          console.error('Error fetching game', err)
        })
        .finally(() => {
          isLoading.set(false)
        })
    } else navigate('/')
  }

  onMount(() => {
    fetchGame()
    const unsubscribe = queryGame.subscribe(() => {
      fetchGame()
    })
    return unsubscribe
  })
</script>

{#if game}
  <FormGame {game} step={5} edit />
{/if}
