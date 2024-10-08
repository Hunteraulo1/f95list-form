import sleep from '$lib/sleep';
import { scrape } from '../data/game';

export type GetScrapeArgs = {
  domain: 'F95z' | 'LewdCorner';
  id: string;
};

export const getScrape = async ({ domain, id }: GetScrapeArgs) => {
  await sleep();

  let mockResponse = await scrape(domain, id);

  if (!mockResponse) {
    mockResponse = {
      name: '',
      status: '',
      tags: '',
      type: '',
      version: '',
      image: '',
    };
  }

  return JSON.parse(JSON.stringify(mockResponse));
};
