<script lang="ts">
import { game } from '$lib/stores';

import type { GameType } from '$types/schemas';
import type { ChangeEventHandler } from 'svelte/elements';

interface Props {
  values?: Array<GameType[keyof GameType]>;
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  name: keyof GameType & string;
}

const { title, values = [], className, active, step, name }: Props = $props();

if (!$game) throw new Error('no game data');

const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
  if (name === 'tname' && event.currentTarget.value === 'Pas de traduction') {
    $game.tversion = '';
    $game.tlink = '';
  }

  if (name === 'tname' && event.currentTarget.value === 'Intégrée') {
    $game.tversion = 'Intégrée';
    $game.tlink = '';

    console.info('handleChange ~ game:', $game);

    return;
  }

  ($game[name] as GameType[keyof GameType]) = event.currentTarget.value;

  if (name === 'domain') {
    if ($game.domain !== 'F95z') $game.ac = false;

    const gameId = $game.id;

    if (!gameId || gameId === 0) return;

    switch ($game.domain) {
      case 'F95z':
        $game.link = `https://f95zone.to/threads/${gameId}`;
        break;
      case 'LewdCorner':
        $game.link = `https://lewdcorner.com/threads/${gameId}`;
        break;
    }
  }
};
</script>

<div class={className} class:hidden={step !== undefined && !active?.includes(step)}>
  <label for={name}>{title}:</label>
  <select
    placeholder={title}
    id={name}
    onchange={handleChange}
    bind:value={$game[name]}
    class="select select-bordered w-full"
    class:border-error={$game[name] === ''}
    >
    {#each Object.values(values) as value}
      <option>{value}</option>
    {/each}
  </select>
</div>
