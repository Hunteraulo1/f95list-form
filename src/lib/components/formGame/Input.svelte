<script lang="ts">
import { game } from '$lib/stores';
import { Game } from '$types/schemas';

import type { GameType } from '$types/schemas';
import { Copy, Link2, Link2Off } from '@steeze-ui/lucide-icons';
import { Icon } from '@steeze-ui/svelte-icon';
import type { Snippet } from 'svelte';
import type { ChangeEventHandler, HTMLInputAttributes } from 'svelte/elements';

interface Props {
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  name: keyof GameType & string;
  type?: HTMLInputElement['type'];
  children?: Snippet;
  attributes?: HTMLInputAttributes;
}

const { title, className, active, step, name, type, children, attributes }: Props = $props();

if (!$game) throw new Error('no game data');

let error = $state(false);

const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  if (name === 'ac' && event.currentTarget instanceof HTMLInputElement) {
    $game.ac = event.currentTarget.checked;

    return;
  }

  const gameId = $game.id;

  if (name === 'id' && gameId && gameId !== 0) {
    switch ($game.domain) {
      case 'F95z':
        $game.link = `https://f95zone.to/threads/${gameId}`;
        break;
      case 'LewdCorner':
        $game.link = `https://lewdcorner.com/threads/${gameId}`;
        break;
    }
  }

  const value = event.currentTarget.value;

  if (type === 'number') {
    ($game[name] as number) = Number.parseInt(value);
  } else {
    ($game[name] as string) = value;
  }
};

const handleInput: ChangeEventHandler<HTMLInputElement> = (event) => {
  if (name === 'ac' || name === 'id') return;

  error = !Game.shape[name].safeParse(event.currentTarget.value).success;
};
</script>

<div class={className} class:hidden={!step || !active?.includes(step)}>
  <label for={name}>{title}:</label>
  <div class="flex gap-1">
    <input
      placeholder={title}
      id={name}
      onchange={handleChange}
      oninput={handleInput}
      disabled={(name === 'tlink' && $game.tname === 'Intégrée') || (name === 'ac' && $game.domain !== 'F95z') || (name === 'id' && $game.domain === 'Autre') || (name === 'tversion' && $game.tname === 'Intégrée') || (name === 'tlink' && $game.tname === 'Pas de traduction') || (name === 'tversion' && $game.tname === 'Pas de traduction')}
      bind:value={$game[name]}
      {type}
      class={type === "checkbox" ? "checkbox checkbox-lg" : "input input-bordered w-full"}
      class:border-error={error}
      {...attributes}
    />
    {#if name === 'tversion'}
      <button
        class="btn w-min"
        class:btn-disable={!$game.version}
        class:btn-primary={$game.version}
        disabled={$game.tname === 'Intégrée' && name === 'tversion'}
        onclick={(e) => {
          e.preventDefault();
          if ($game.version) $game.tversion = $game.version;
        }}>
        <Icon src={Copy} size="1rem" />
    </button>
    {:else if name === 'link'}
      <a
        href={$game.link}
        target="_blank"
        class="btn w-min"
        class:btn-disable={!$game.link}
        class:btn-primary={$game.link}>
        <Icon src={$game.link ? Link2 : Link2Off} size="1rem" />
      </a>
    {:else if name === 'tlink'}
      <a
        href={$game.tlink}
        target="_blank"
        class="btn w-min"
        class:btn-disable={!$game.tlink}
        class:btn-primary={$game.tlink}>
        <Icon src={$game.tlink ? Link2 : Link2Off} size="1rem" />
      </a>
    {/if}
    {@render children?.()}
  </div>
</div>
