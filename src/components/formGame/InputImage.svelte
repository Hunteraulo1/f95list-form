<script lang="ts">
import type { GameType } from '$types/schemas';
import type { HTMLInputAttributes } from 'svelte/elements';
import Input from './Input.svelte';

interface Props {
  title: string;
  active?: number[];
  step?: number;
  game: GameType;
  name: keyof GameType;
}

const { game = $bindable(), step, title, active, name }: Props = $props();

const handleImageError = (e: Event): void => {
  const target = e.currentTarget as HTMLImageElement;

  if (game.image.startsWith('https://attachments.f95zone.to/')) {
    target.src = game.image.replace('attachments', 'preview');
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
  {game}
  {active}
  {step}
  className="imgHint relative"
  {title}
  {name}
  type="text">
  <img
    src={game.image}
    alt="bannière du jeu 2"
    class="absolute top-20 hidden w-full max-w-md rounded-md"
    loading="lazy"
    onerror={handleImageError}
  />
</Input>
