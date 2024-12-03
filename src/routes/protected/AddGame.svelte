<script lang="ts">
import FormGame from '$components/FormGame.svelte';
import { game, queryGame } from '$lib/stores';

$queryGame = undefined;
$game = {
  status: 'EN COURS',
  type: 'RenPy',
  tname: 'Traduction',
  ttype: 'Traduction Humaine',
  ac: false,
  domain: 'F95z',
  id: null,
  link: '',
  name: '',
  proofreader: '',
  tags: '',
  tlink: '',
  traductor: '',
  tversion: '',
  version: '',
  trlink: '',
  image: '',
};
</script>

<FormGame />
 