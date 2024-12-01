<script lang="ts">
import type { GameType } from '$types/schemas';
import type { ChangeEventHandler, HTMLSelectAttributes } from 'svelte/elements';

interface Props extends HTMLSelectAttributes {
  values?: Array<GameType[keyof GameType]>;
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  game: GameType;
  name: keyof GameType;
}

const { title, values = [], className, active, step, game = $bindable(), name }: Props = $props();

const handleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
  if (name === 'tname' && event.currentTarget.value === 'Intégrée') {
    game.tversion = 'Intégrée';

    console.info('handleChange ~ game:', game);

    return;
  }

  (game[name] as string) = event.currentTarget.value;

  const { domain, id } = game;
  if (name === 'domain' && id && id !== 0) {
    switch (domain) {
      case 'F95z':
        game.link = `https://f95zone.to/threads/${id}`;
        break;
      case 'LewdCorner':
        game.link = `https://lewdcorner.com/threads/${id}`;
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
    bind:value={game[name]}
    class="select select-bordered w-full"
    >
    {#each Object.values(values) as value}
      <option>{value}</option>
    {/each}
  </select>
</div>
