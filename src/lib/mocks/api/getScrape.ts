import { type GameType, ScrapeGame } from '$types/schemas';
import { scrape } from '../data/scrape';

export type GetScrapeArgs = {
  domain: 'F95z' | 'LewdCorner';
  id: string;
};
interface GetScrape {
  name: GameType['name'];
  version: GameType['version'];
  status: GameType['status'];
  tags: GameType['tags'];
  type: GameType['type'];
  image: GameType['image'];
}

export const getScrape = async ({ domain, id }: GetScrapeArgs): Promise<GetScrape> => {
  // Report request
  console.info(`getScrape called with args: ${{ domain, id }}`);

  if (domain !== 'F95z') throw new Error('domaine incompatible');

  const mockResponse = scrape[id];
  console.log('🚀 ~ getScrape ~ mockResponse:', mockResponse);

  const validScrapeGame = ScrapeGame.parse(scrape[id]);
  console.log('🚀 ~ getScrape ~ validScrapeGame:', validScrapeGame);

  return validScrapeGame;
};
