<script lang="ts">
import { navigate } from 'svelte-routing';

interface Props {
  to?: string;
  onClick: () => void;
  children?: import('svelte').Snippet;
}

const { to = '', onClick, children }: Props = $props();

const handleClick = (): void => {
  navigate(to);
  onClick();
};
</script>

<li>
  <button onclick={handleClick}>
    {@render children?.()}
  </button>
</li>
