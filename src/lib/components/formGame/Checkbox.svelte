<script lang="ts">
import { game } from '$lib/stores';
import { checkUser } from '$lib/utils';

import type { GameType } from '$types/schemas';
import type { ChangeEventHandler } from 'svelte/elements';

interface Props {
  title: string;
  active?: number[];
  step?: number;
  name: keyof GameType & string;
}

const { title, active, step, name }: Props = $props();

if (!$game) throw new Error('no game data');

const error = $state(false);

const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  ($game[name] as string) = event.currentTarget.value;

  $game.ac = event.currentTarget.checked;
};
</script>

{#if typeof $game[name] === 'boolean'}
  <div class="flex h-full w-full flex-col justify-center" class:hidden={!step || !active?.includes(step) || !checkUser(['admin', 'superAdmin'])}>
    <label for={name}>{title}:</label>
    <input
      placeholder={title}
      id={name}
      type="checkbox"
      onchange={handleChange}
      disabled={name === 'ac' && $game.domain !== 'F95z'}
      bind:checked={$game[name]}
      class="checkbox checkbox-lg"
      class:border-error={error}
    />
  </div>
{/if}
