<script lang="ts">
import { game } from '$lib/stores';

import type { GameType } from '$types/schemas';

interface ScrapeDataArgs {
  id: GameType['id'];
  domain: Extract<GameType['domain'], 'F95z'>;
}

interface Props {
  step: number;
  scrapeData: (args: ScrapeDataArgs) => Promise<void>;
}

let { step, scrapeData }: Props = $props();

const handleClick = (): void => {
  step = 5;
  $game = {
    domain: 'Autre',
    id: 666,
    name: 'TEST GAME FOR DEV',
    link: 'https://testgame.dev',
    status: 'ABANDONNÉ',
    tags: 'TEST, DEV, NE PAS TOUCHER',
    type: 'Autre',
    version: 'v666',
    tversion: 'n/a',
    tname: 'Pas de traduction',
    tlink: 'https://traduction.dev',
    traductor: 'Hunteraulo',
    proofreader: 'Hunteraulo',
    ttype: 'À tester',
    ac: false,
    image: 'https://attachments.f95zone.to/2024/04/3572650_Remaster_HD.png',
  };
};
</script>

<button
  class="btn btn-info w-full sm:w-48"
  type="button"
  onclick={handleClick}>
  Dev data
</button>
{#if $game.domain === "F95z"}
  <button
    class="btn btn-info w-full sm:w-48"
    type="button"
    onclick={() => scrapeData({ id: $game.id, domain: 'F95z' })}>
    Force scrape
  </button>
{/if}
