<script lang="ts">
  import { Link } from 'svelte-routing'

  export let to = ''
</script>

<li>
  <Link {to}>
    <slot />
  </Link>
</li>
