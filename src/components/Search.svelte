<script lang="ts">
import { onMount } from 'svelte';
import { Link, navigate } from 'svelte-routing';
import type { ChangeEventHandler } from 'svelte/elements';

import Panel from '$components/Panel.svelte';
import checkUser from '$lib/checkUser';
import { fetchQueryGames } from '$lib/queryGames';
import { queryGame, queryGames } from '$lib/stores';
import type { QueryGameType } from '$types/schemas';

interface Props {
  edit?: boolean;
}

let { edit = false }: Props = $props();

let inputSearch = $state(edit ? $queryGame.name : '');
let badgeSearch = $state(edit ? $queryGame.version : '');

let filtered: QueryGameType[] = $state([]);
let timer: ReturnType<typeof setTimeout>;

const isAdmin = checkUser(['admin']);

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

const handleClick = (data: QueryGameType) => {
  inputSearch = data.name;
  badgeSearch = data.version;
  filtered = [];
  $queryGame = data;

  if (isAdmin) navigate('/edit');
  else navigate('/submit-edit');
};

const handleFocus = () => {
  if (!badgeSearch) return;

  inputSearch = '';
  badgeSearch = '';
};

const handleCtrlK = (event: KeyboardEvent) => {
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

<Panel title="Rechercher un jeu" showDivider={false}>
  <div slot="panelContent">
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

      <Link to={isAdmin ? "/add" : "submit-add"} class="btn btn-primary sm:w-40">AJOUTER UN JEU</Link>
    </div>
  </div>
</Panel>
