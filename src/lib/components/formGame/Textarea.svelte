<script lang="ts">
import { game } from '$lib/stores';

import type { GameType } from '$types/schemas';
import type { ChangeEventHandler, HTMLTextareaAttributes } from 'svelte/elements';

interface Props extends HTMLTextareaAttributes {
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  name: keyof GameType & string;
}

const { title, className, active, step, name }: Props = $props();

if (!$game) throw new Error('no game data');

const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
  ($game[name] as GameType[keyof GameType]) = event.currentTarget.value;
};
</script>

<div class={className} class:hidden={!step || !active?.includes(step)}>
  <label for={name}>{title}:</label>
  <div class="flex gap-1">
    <textarea
      placeholder={title}
      id={name}
      onchange={handleChange}
      class="textarea textarea-bordered textarea-xs max-h-32 min-h-10 h-10 w-full"
    >{$game[name]}</textarea>
  </div>
</div>
