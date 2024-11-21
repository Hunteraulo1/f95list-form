<script lang="ts">
import checkUser from '$lib/checkUser';
import { type GameType } from '$types/schemas';
import type { ChangeEventHandler } from 'svelte/elements';

interface Props {
  title: string;
  active?: number[];
  checked?: boolean;
  step?: number;
  game: GameType;
  name: keyof GameType;
}

let { title, active, step, game, name, checked }: Props = $props();

let error = $state(false);

const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  (game[name] as string) = event.currentTarget.value;

  game.ac = event.currentTarget.checked;
};
</script>

<div class="flex h-full w-full flex-col justify-center" class:hidden={!step || !active?.includes(step) || !checkUser(['admin', 'superAdmin'])}>
  <label for={name}>{title}:</label>
  <div class="flex gap-1">
    <input
      placeholder={title}
      id={name}
      type="checkbox"
      onchange={handleChange}
      disabled={name === 'ac' && game.domain !== 'F95z'}
      {checked}
      class="checkbox checkbox-lg"
      class:border-error={error}
    />
  </div>
</div>
