<script lang="ts">
import FormGame from '$components/FormGame.svelte';
import { queryGame } from '$lib/stores';

$queryGame = undefined;
</script>

<FormGame />
 