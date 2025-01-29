<script lang="ts">
import AddTraductorModal from '$components/AddTraductorModal.svelte';
import { game, traductors } from '$lib/stores';
import { checkUser } from '$lib/utils';
import type { GameType } from '$types/schemas';

import { UserPlus } from '@steeze-ui/lucide-icons';
import { Icon } from '@steeze-ui/svelte-icon';
import type { ChangeEventHandler, HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  name: keyof GameType & string;
}

const { title, className, active, step, name }: Props = $props();

if (!$game) throw new Error('no game data');

const isTraductor = checkUser(['traductor']);

const handleWarning = (value: string): boolean => {
  if (isTraductor || $game[name] === '') return false;

  return !$traductors.find((item) => item.name === value);
};

const handleError = (): boolean => {
  if ($game.traductor === '') return false;

  return $game.traductor === $game.proofreader;
};

let warning = $state(handleWarning($game[name] as string));
let error = $state(handleError());

const handleChange: ChangeEventHandler<HTMLInputElement> = (event): void => {
  const value = event.currentTarget.value;

  ($game[name] as string) = value;
};

const handleInput: ChangeEventHandler<HTMLInputElement> = (event): void => {
  warning = handleWarning(event.currentTarget.value);
  error = handleError();
};

let modal = $state(false);
</script>

<div class={className} class:hidden={!step || !active?.includes(step)}>
  <label for={name}>{title}:</label>
  <div class="flex gap-1">
    <input
      placeholder={title}
      type="search"
      id={name}
      list="traductor-list"
      disabled={$traductors.length === 0}
      onchange={handleChange}
      oninput={handleInput}
      bind:value={$game[name]}
      class="input input-bordered w-full"
      class:input-warning={warning}
      class:input-error={error}
    />
    <datalist id="traductor-list">
      {#each $traductors as item}
        <option>{item.name}</option>
      {/each}
    </datalist>
    {#if checkUser(['admin', 'superAdmin'])}
      <button
        class="btn btn-primary w-min"
        onclick={(e) => {
          e.preventDefault();
          modal = true;
        }}>
        <Icon src={UserPlus} size="1rem" />
      </button>
    {/if}
  </div>
</div>

<AddTraductorModal
  bind:showModal={modal}
  name={$game.traductor}
/>
