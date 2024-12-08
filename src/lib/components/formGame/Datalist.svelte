<script lang="ts">
import AddTraductorModal from '$components/AddTraductorModal.svelte';
import { game, traductors } from '$lib/stores';
import { checkUser } from '$lib/utils';
import { Icon, UserPlus } from 'svelte-hero-icons';

import type { GameType } from '$types/schemas';
import type { ChangeEventHandler, HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  name: keyof GameType;
}

const { title, className, active, step, name }: Props = $props();

const isTraductor = checkUser(['traductor']);

const checkValue = (value: string): boolean => {
  if (isTraductor || $game[name] === '') return false;

  return !$traductors.find((item) => item.name === value);
};

let warning = $state(checkValue($game[name] as string));

const handleChange: ChangeEventHandler<HTMLInputElement> = (event): void => {
  const value = event.currentTarget.value;

  ($game[name] as string) = value;
};

const handleInput: ChangeEventHandler<HTMLInputElement> = (event): void => {
  warning = checkValue(event.currentTarget.value);
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
      class="input input-bordered w-full {warning ? 'input-warning' : ''}"
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
