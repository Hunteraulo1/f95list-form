<script lang="ts">
  import { navigate } from 'svelte-routing'

  export let to = ''
  export let onClick = () => {}

  const handleClick = () => {
    navigate(to)
    onClick()
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleClick()
    }
  }
</script>

<li>
  <button on:click={handleClick} on:keypress={handleKeyPress}>
    <slot />
  </button>
</li>
