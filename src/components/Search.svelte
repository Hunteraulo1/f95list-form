<script lang="ts">
  import { onMount } from 'svelte'
  import { Link, navigate } from 'svelte-routing'
  import Panel from '../components/Panel.svelte'
  import { fetchQueryGames } from '../lib/queryGames'
  import { queryGame, queryGames } from '../stores'
  import type { QueryGame } from '../types/types'

  export let edit = false

  let inputSearch = edit ? $queryGame.name : ''
  let spanSearch = edit ? $queryGame.version : ''
  onMount(() => {
    fetchQueryGames()
  })

  let filtered: QueryGame[] = []
  const handleChange = (
    event: Event & { currentTarget: EventTarget & HTMLInputElement }
  ) => {
    spanSearch = ''

    filtered = $queryGames?.filter(game => {
      const value = event.currentTarget.value

      return game.name.toLowerCase().includes(value.toLowerCase())
    })

    console.log({ inputSearch, filtered })
    filtered = inputSearch !== '' ? filtered : []
  }
  const handleClick = (data: QueryGame) => {
    spanSearch = data.version
    inputSearch = data.name
    filtered = []
    queryGame.set(data)
    navigate('/edit')
  }

  const handleKeyPress = (event: KeyboardEvent, item: QueryGame) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick(item)
    }
  }

  const handleFocus = () => {
    if (spanSearch !== '') {
      inputSearch = ''
      spanSearch = ''
    }
  }

  const handleCtrlK = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault()
      const inputField = document.getElementById('searchField')
      if (inputField) {
        inputField.focus()
      }
    }
  }
</script>

<svelte:window on:keydown={handleCtrlK} />

<Panel title="Rechercher un jeu" showDivider={false}>
  <div slot="panel-content">
    <div class="flex gap-4 sm:flex-row flex-col">
      <div id="container-search" class="relative w-full">
        <label class="input input-bordered flex items-center gap-2">
          <input
            disabled={$queryGames === undefined}
            type="text"
            placeholder="Rechercher un jeu"
            class="bg-transparent grow"
            name="theme"
            id="searchField"
            bind:value={inputSearch}
            on:input={handleChange}
            on:focus={handleFocus}
          />
          {#if spanSearch}
            <span class="badge badge-primary">{spanSearch}</span>
          {/if}
          <kbd class="kbd kbd-sm">ctrl</kbd>
          <kbd class="kbd kbd-sm">K</kbd>
        </label>

        {#if filtered.length > 0}
          <ul class="z-10 w-full menu bg-base-200 rounded-box absolute">
            {#each filtered as item, index}
              {#if index < 10}
                <li>
                  <button
                    class="w-full"
                    tabindex="0"
                    on:click={() => handleClick(item)}
                    on:keypress={e => handleKeyPress(e, item)}
                  >
                    {item.name}
                    <span class="badge badge-primary">{item.version}</span>
                  </button>
                </li>
              {/if}
            {/each}
          </ul>
        {/if}
        <span id="span-search"></span>
      </div>
      <Link to="/add" class="btn btn-primary sm:w-40">AJOUTER UN JEU</Link>
    </div>
  </div>
</Panel>
