<script lang="ts">
  import Panel from '$components/Panel.svelte'
  import { fetchQueryGames } from '$lib/queryGames'
  import { queryGame, queryGames } from '$lib/stores'
  import type { QueryGameType } from '$types/schemas'
  import { onMount } from 'svelte'
  import { Link, navigate } from 'svelte-routing'
  import type { ChangeEventHandler } from 'svelte/elements'

  export let edit = false

  let inputSearch = edit ? $queryGame.name : ''
  let badgeSearch = edit ? $queryGame.version : ''

  let filtered: QueryGameType[] = []
  let timer: NodeJS.Timeout

  const handleChange: ChangeEventHandler<HTMLInputElement> = event => {
    badgeSearch = ''

    if (!inputSearch) {
      filtered = []

      return
    }

    clearTimeout(timer)
    const value = event.currentTarget.value

    timer = setTimeout(() => {
      filtered = $queryGames.filter(game => {
        return game.name.toLowerCase().includes(value.toLowerCase())
      })
    }, 200)
  }

  const handleClick = (data: QueryGameType) => {
    inputSearch = data.name
    badgeSearch = data.version
    filtered = []
    $queryGame = data

    navigate('/edit')
  }

  const handleFocus = () => {
    if (!badgeSearch) return

    inputSearch = ''
    badgeSearch = ''
  }

  const handleCtrlK = (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === 'k') {
      event.preventDefault()

      const inputField = document.getElementById('searchField')
      inputField?.focus()
    }
  }

  onMount(() => {
    fetchQueryGames()
  })
</script>

<svelte:window on:keydown={handleCtrlK} />

<Panel title="Rechercher un jeu" showDivider={false}>
  <div slot="panel-content">
    <div class="flex flex-col gap-4 sm:flex-row">
      <div id="container-search" class="relative w-full">
        <label class="input input-bordered flex items-center gap-2">
          <input
            disabled={$queryGames.length === 0}
            type="text"
            placeholder="Rechercher un jeu"
            class="grow bg-transparent"
            name="theme"
            id="searchField"
            autocomplete="off"
            bind:value={inputSearch}
            on:input={handleChange}
            on:focus={handleFocus}
          />

          {#if badgeSearch}
            <span class="badge badge-primary">{badgeSearch}</span>
          {/if}

          <kbd class="kbd kbd-sm">ctrl</kbd>
          <kbd class="kbd kbd-sm">K</kbd>
        </label>

        {#if filtered.length > 0}
          <ul class="menu absolute z-10 w-full rounded-box bg-base-200">
            {#each filtered as item, index}
              {#if index < 10}
                <li>
                  <button
                    class="w-full"
                    tabindex="0"
                    on:click={() => handleClick(item)}
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
