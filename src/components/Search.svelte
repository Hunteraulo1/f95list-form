<script lang="ts">
  import Panel from '../components/Panel.svelte'
  import { isLoading, queryGame } from '../stores'
  import type { QueryGame } from '../types/types'

  let list: QueryGame[] = [
    { name: 'test', version: 'v1.0' },
    { name: 'truc', version: 'v1.12' },
    { name: 'yolo', version: 'v0.41' }
  ] // TODO: à supprimer

  let filtered: QueryGame[] = []
  function handleChange() {
    spanSearch = ''

    filtered = list.filter((l, i) => {
      // @ts-ignore
      const value = this.value

      if (i <= 5 && value) {
        return l.name.toLowerCase().includes(value.toLowerCase())
      }
      return false
    })
  }

  let inputSearch = ''
  let spanSearch = ''
  function handleClick(data: QueryGame) {
    spanSearch = data.version
    inputSearch = data.name
    filtered = []
    queryGame.set(data)
  }

  function handleKeyPress(event: any, item: QueryGame) {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick(item)
    }
  }

  function handleClickReset() {
    inputSearch = ''
    spanSearch = ''
  }
</script>

<Panel title="Rechercher un jeu" description={false}>
  <div slot="panel-content">
    <div class="flex gap-4">
      <div id="container-search" class="relative w-full">
        <input
          disabled={$isLoading}
          type="text"
          placeholder="Rechercher un jeu"
          class="w-full input input-bordered"
          name="theme"
          value={inputSearch}
          on:input={handleChange}
          on:click={handleClickReset}
        />
        {#if spanSearch}
          <div class="absolute top-0 flex items-center h-full right-4">
            <div class="badge badge-primary">{spanSearch}</div>
          </div>
        {/if}
        {#if filtered.length > 0}
          <ul class="z-10 w-full menu bg-base-200 rounded-box">
            {#each filtered as item}
              <li>
                <button
                  class="w-full"
                  tabindex="0"
                  on:click={() => handleClick(item)}
                  on:keypress={e => handleKeyPress(e, item)}
                >
                  {item.name}
                  <div class="badge badge-primary">{item.version}</div>
                </button>
              </li>
            {/each}
          </ul>
        {/if}
        <span id="span-search"></span>
      </div>
      <a href="/add">
        <button class="btn btn-primary">AJOUTER UN JEU</button>
      </a>
    </div>
  </div>
</Panel>
