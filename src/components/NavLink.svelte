<script lang="ts">
import { navigate } from 'svelte-routing';

export let to = '';
export let onClick;

const handleClick = () => {
  navigate(to);
  onClick();
};
</script>

<li>
  <button on:click={handleClick}>
    <slot />
  </button>
</li>
