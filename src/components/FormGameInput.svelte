<script lang="ts">
import { Game, type GameType } from '$types/schemas';
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

let error = $state(false);

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

const handleInput: ChangeEventHandler<HTMLInputElement> = (event) => {
  const { success } = Game.shape[name].safeParse(event.currentTarget.value);

  error = !success;
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
      {...rest}
      class="{rest.type === "checkbox" ? "checkbox checkbox-lg" : "input input-bordered w-full"} {rest.class}"
      class:border-error={error}
    />
    {@render children?.()}
  </div>
</div>
