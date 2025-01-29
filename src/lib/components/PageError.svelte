<script lang="ts">
import { TriangleAlert } from '@steeze-ui/lucide-icons';
import { Icon } from '@steeze-ui/svelte-icon';
import { Link } from 'svelte-routing';

interface Props {
  text: string;
}

const { text }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-20">
  <div class="text-[hsl(var(--er))]">
    <Icon src={TriangleAlert} size="3rem" />
  </div>
  <div class="pb-2 pt-2">
    <p>{text}</p>
  </div>
  <div class="py-4">
    <h2>
      <Link to="/"><span class="link">Retour à la page d'accueil</span></Link>
    </h2>
  </div>
</div>
