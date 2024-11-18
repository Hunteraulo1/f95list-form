<script lang="ts">
import FormGame from '$components/FormGame.svelte';
import checkUser from '$lib/checkUser';
</script>

<FormGame isAdmin={checkUser(['admin'])} />
 