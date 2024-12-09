<script lang="ts">
import { game } from '$lib/stores';
import Input from './Input.svelte';

import type { GameType } from '$types/schemas';
import type { HTMLInputAttributes } from 'svelte/elements';

interface Props {
  title: string;
  active?: number[];
  step?: number;
  name: keyof GameType;
}

const { step, title, active, name }: Props = $props();

if (!$game) throw new Error('no game data');

const handleImageError = (e: Event): void => {
  const target = e.currentTarget as HTMLImageElement;

  if ($game.image.startsWith('https://attachments.f95zone.to/')) {
    target.src = $game.image.replace('attachments', 'preview');
  } else {
    target.classList.add('hidden');
  }
};

const attributes: HTMLInputAttributes = {
  onfocusin: (e: FocusEvent) => (e.currentTarget as HTMLInputElement).nextElementSibling?.classList.remove('hidden'),
  onfocusout: (e: FocusEvent) => (e.currentTarget as HTMLInputElement).nextElementSibling?.classList.add('hidden'),
  required: true,
};
</script>

<Input
  {active}
  {step}
  className="imgHint relative"
  {title}
  {name}
  {attributes}
  type="text">
  <img
    src={$game.image}
    alt="bannière du jeu 2"
    class="absolute top-20 hidden w-full max-w-md rounded-md"
    loading="lazy"
    onerror={handleImageError}
  />
</Input>
