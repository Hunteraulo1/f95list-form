<script lang="ts">
import { GAS_API } from '$lib/GAS_API';
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
const id: number = $state(0);

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

const handleClickScrape = async (): Promise<void> => {
  try {
    const result = GAS_API.getScrape({ domain: 'F95z', id });

    console.info(result);
  } catch (error) {
    console.error(error);
  }
};
</script>

<button
  class="btn btn-info w-full sm:w-48"
  type="button"
  onclick={handleClick}>
  Dev data
</button>

<div class="flex">
  <input value={id} type="number" />
  <button
    class="btn btn-info w-full sm:w-48"
    type="button"
    onclick={handleClickScrape}>
    Valider
  </button>
</div>

{#if $game && $game.domain === "F95z"}
  <button
    class="btn btn-info w-full sm:w-48"
    type="button"
    onclick={() => {
      if (!$game) throw new Error('no game data');
      
      scrapeData({ id: $game.id, domain: 'F95z' })
    }}>
    Force scrape
  </button>
{/if}
