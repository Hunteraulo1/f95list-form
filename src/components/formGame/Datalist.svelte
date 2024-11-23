<script lang="ts">
import AddTraductorModal from '$components/AddTraductorModal.svelte';
import { checkUser } from '$lib/utils';
import type { GameType, TraductorType } from '$types/schemas';
import { Icon, UserPlus } from 'svelte-hero-icons';
import type { ChangeEventHandler, HTMLInputAttributes } from 'svelte/elements';

interface Props extends HTMLInputAttributes {
  values?: TraductorType[];
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  game: GameType;
  name: keyof GameType;
}

let { title, values = [], className, active, step, game, name }: Props = $props();

let warning = $state(false);
const isTraductor = checkUser(['traductor']);

const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
  const value = event.currentTarget.value;

  (game[name] as string) = value;

  if (values.find((item) => item.name === value) || isTraductor) return;

  warning = true;
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
      onchange={handleChange}
      value={game[name]}
      class="input input-bordered w-full {warning ? 'input-warning' : ''}"
    />
    <datalist id="traductor-list">
      {#each values as item}
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
  name={game.traductor}
/>
