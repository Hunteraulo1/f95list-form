<script lang="ts">
import type { GameType } from '$types/schemas';
import type { Snippet } from 'svelte';
import type { ChangeEventHandler, HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
  title: string;
  children?: Snippet;
  className?: string;
  active?: number[];
  step?: number;
  game: GameType;
  name: keyof GameType;
}

let { title, children, className, active, step, game, name, ...rest }: Props = $props();

const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  (game[name] as string) = event.currentTarget.value;

  const { domain, id } = game;

  if (name === 'ac' && event.currentTarget instanceof HTMLInputElement) {
    game.ac = event.currentTarget.checked;

    return;
  }

  if (name === 'id' && id && id !== '0') {
    switch (domain) {
      case 'F95z':
        game.link = `https://f95zone.to/threads/${id}`;
        break;
      case 'LewdCorner':
        game.link = `https://lewdcorner.com/threads/${id}`;
        break;
    }
  }
};
</script>

<div class={className} class:hidden={!step || !active?.includes(step)}>
  <label for={name}>{title}:</label>
  <div class="flex gap-1">
    <input
    placeholder={title}
    id={name}
    class="input input-bordered w-full"
    onchange={handleChange}
    {...rest}
    />
    {@render children?.()}
  </div>
</div>
