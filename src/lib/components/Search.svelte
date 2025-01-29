<script lang="ts">
import Panel from '$components/Panel.svelte';
import { fetchQueryGames } from '$lib/queryGames';
import { game, queryGame, queryGames } from '$lib/stores';
import { onMount } from 'svelte';
import { Link, navigate } from 'svelte-routing';

import type { QueryGameType } from '$types/schemas';
import type { ChangeEventHandler } from 'svelte/elements';

interface Props {
  edit?: boolean;
}

const { edit = false }: Props = $props();

let inputSearch = $state(edit ? $queryGame?.name : '');
let badgeSearch = $state(edit ? $queryGame?.version : '');

let filtered: QueryGameType[] = $state([]);
let timer: ReturnType<typeof setTimeout>;

const handleInput: ChangeEventHandler<HTMLInputElement> = (event) => {
  badgeSearch = '';

  const eventValue = event.currentTarget.value;

  clearTimeout(timer);

  timer = setTimeout(() => {
    if (eventValue === '') {
      filtered = [];

      return;
    }

    filtered = $queryGames.filter((game) => {
      const value = eventValue.toLowerCase();

      const name = game.name.toLowerCase();
      const id = game.id ? game.id.toString().toLowerCase() : '';

      if (name.includes(value) || id.includes(value)) return game;
    });
  }, 200);
};

const handleClick = (data: QueryGameType): void => {
  inputSearch = data.name;
  badgeSearch = data.version;
  filtered = [];
  $queryGame = data;
  $game = undefined;

  navigate('/edit');
};

const handleFocus = (): void => {
  if (!badgeSearch) return;

  inputSearch = '';
  badgeSearch = '';
};

const handleCtrlK = (event: KeyboardEvent): void => {
  if (event.ctrlKey && event.key === 'k') {
    const inputField = document.getElementById('searchField');
    inputField?.focus();
  }
};

onMount(() => {
  fetchQueryGames();
});
</script>

<svelte:window onkeydown={handleCtrlK} />

<Panel title="Ajouter/Modifier un jeu sur la liste" showDivider={false}>
  {#snippet panelContent()}
    <div class="flex flex-col gap-4 sm:flex-row">
      <div id="container-search" class="relative w-full">
        <label class="input input-bordered flex items-center gap-2 w-full">
          <input
            disabled={$queryGames.length === 0}
            type="text"
            placeholder="Rechercher un jeu dans la liste"
            class="grow bg-transparent"
            name="theme"
            id="searchField"
            autocomplete="off"
            bind:value={inputSearch}
            oninput={handleInput}
            onfocus={handleFocus} />

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
                  <button class="w-full" tabindex="0" onclick={() => handleClick(item)}>
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
  {/snippet}
</Panel>
