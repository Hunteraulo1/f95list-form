import { ScrapeGame } from '$types/schemas';
import { scrape } from '../data/scrape';

import type { GameType } from '$types/schemas';

export interface GetScrapeArgs {
  domain: Extract<GameType['domain'], 'F95z'>;
  id: GameType['id'];
}

interface GetScrape {
  name: GameType['name'];
  version: GameType['version'];
  status: GameType['status'];
  tags: GameType['tags'];
  type: GameType['type'];
  image: GameType['image'];
}
export const getScrape = async ({ domain, id }: GetScrapeArgs): Promise<GetScrape> => {
  console.info('getScrape ~ args:', { domain, id });

  if (domain !== 'F95z') throw new Error('getScrape ~ domaine incompatible');

  if (!id) throw new Error('getScrape ~ no id');

  const validScrapeGame = ScrapeGame.parse(scrape[id]);

  console.info('getScrape ~ validScrapeGame:', validScrapeGame);

  return validScrapeGame;
};
