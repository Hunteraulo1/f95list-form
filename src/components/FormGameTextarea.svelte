<script lang="ts">
import type { GameType } from '$types/schemas';
import type { Snippet } from 'svelte';
import type { ChangeEventHandler, HTMLTextareaAttributes } from 'svelte/elements';

interface Props extends HTMLTextareaAttributes {
  title: string;
  children?: Snippet;
  className?: string;
  active?: number[];
  step?: number;
  game: GameType;
  name: keyof GameType;
}

let { title, children, className, active, step, game, name, ...rest }: Props = $props();

const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
  (game[name] as string) = event.currentTarget.value;
};
</script>

<div class={className} class:hidden={!step || !active?.includes(step)}>
  <label for={name}>{title}:</label>
  <div class="flex gap-1">
    <textarea
    placeholder={title}
    id={name}
    class="textarea textarea-bordered textarea-xs max-h-32 w-full"
    onchange={handleChange}
    {...rest}
    ></textarea>
    {@render children?.()}
  </div>
</div>
