<script lang="ts">
import type { GameType } from '$types/schemas';
import FormGameInput from './Input.svelte';

interface Props {
  title: string;
  className?: string;
  active?: number[];
  step?: number;
  game: GameType;
  name: keyof GameType;
}

let { game, step, title, className, active, name }: Props = $props();

const handleImageError = (e: Event) => {
  const target = e.currentTarget as HTMLImageElement;

  if (game.image.startsWith('https://attachments.f95zone.to/')) {
    target.src = game.image.replace('attachments', 'preview');
  } else {
    target.classList.add('hidden');
  }
};
</script>

<FormGameInput
  value={game.image}
  {game}
  {active}
  {step}
  {className}
  {title}
  {name}
  type="text"
  onfocusin={(e) =>
    e.currentTarget.nextElementSibling?.classList.remove("hidden")}
  onfocusout={(e) =>
    e.currentTarget.nextElementSibling?.classList.add("hidden")}
  required>
  <img
    src={game.image}
    alt="bannière du jeu 2"
    class="absolute top-20 hidden w-full max-w-md rounded-md"
    loading="lazy"
    onerror={handleImageError}
  />
</FormGameInput>
