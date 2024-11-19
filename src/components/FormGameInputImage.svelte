<script lang="ts">
import type { GameType } from '$types/schemas';
import FormGameInput from './FormGameInput.svelte';

interface Props {
  game: GameType;
  step: number;
}

let { game, step }: Props = $props();

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
  active={[6, 5]}
  {step}
  className="imgHint relative"
  title="Lien de l'image"
  name="image"
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
