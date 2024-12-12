import { ScrapeGame } from '$types/schemas';
import { scrape } from '../data/scrape';

import type { GameType, ScrapeGameType } from '$types/schemas';

export interface GetScrapeArgs {
  domain: Extract<GameType['domain'], 'F95z'>;
  id: GameType['id'];
}

export const getScrape = async ({ domain, id }: GetScrapeArgs): Promise<ScrapeGameType> => {
  console.info('getScrape ~ args:', { domain, id });

  if (domain !== 'F95z') throw new Error('getScrape ~ domaine incompatible');

  if (!id) throw new Error('getScrape ~ no id');

  const validScrapeGame = ScrapeGame.parse(scrape[id]);

  console.info('getScrape ~ validScrapeGame:', validScrapeGame);

  return validScrapeGame;
};
