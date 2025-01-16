import { ScrapeGame } from '$types/schemas';
import Cheerio from 'cheerio';
import { f95z } from '../lib/f95z';

import type { GameType, ScrapeGameType } from '$types/schemas';
export interface GetScrapeArgs {
  domain: Extract<GameType['domain'], 'F95z'>;
  id: GameType['id'];
}

export const getScrape = async ({ domain, id }: GetScrapeArgs): Promise<ScrapeGameType> => {
  console.info('getScrape ~ args:', { domain, id });

  if (domain !== 'F95z') throw new Error('getScrape ~ domaine incompatible');

  const link = `https://f95zone.to/threads/${id}`;
  const regName = /^([^\[]+)\s/i;
  const regTitle = /([\w\\']+)(?=\s-)/gi;

  const response = UrlFetchApp.fetch(link, {
    muteHttpExceptions: true,
  });
  const $ = Cheerio.load(response.getContentText());

  const tagsData = $('.tagItem')
    .map((_, tag) => $(tag).text().trim())
    .get();
  const tags = tagsData.length > 0 ? tagsData.join(', ') : null;

  const title = $('title').text();
  const img = $('img.bbImage').attr('src');
  const pTitle = $('.p-title-value').text();

  const image = img?.replace('thumb/', '') ?? null;

  const titleMatch = title.match(regTitle);
  const nameMatch = pTitle.match(regName) ?? [];

  const name = nameMatch?.[1] ?? null;

  const { status, type } = titleMatch ? scrapeGetTitle(titleMatch) : { status: null, type: null };

  let version = null;

  try {
    const result = await f95z(id);

    version = result ?? null;
  } catch (error) {
    console.error('getScrape ~ Error getFetchF95z: ', error);
    throw new Error('getScrape ~ getFetchF95z no return');
  }

  console.info('scrapePage ~ args:', {
    name,
    version,
    status,
    tags,
    type,
    image,
    domain,
  });

  const validScrapeGame = ScrapeGame.parse({
    name,
    version,
    status,
    tags,
    type,
    image,
  });

  console.info('getScrape ~ validScrapeGame:', validScrapeGame);

  return validScrapeGame;
};

const scrapeGetTitle = (data: string[]): { status: string | null; type: string | null } => {
  let status = null;
  let type = null;

  for (const e of data) {
    switch (e) {
      case 'Abandoned':
        status = 'ABANDONNÉ';
        break;
      case 'Completed':
        status = 'TERMINÉ';
        break;
      default:
        status = 'EN COURS';
        break;
    }
    switch (e) {
      case "Ren'Py":
        type = 'RenPy';
        break;
      case 'RPGM':
        type = 'RPGM';
        break;
      case 'Unity':
        type = 'Unity';
        break;
      case 'Unreal Engine':
        type = 'Unreal';
        break;
      case 'Flash':
        type = 'Flash';
        break;
      case 'HTML':
        type = 'HTML';
        break;
      case 'QSP':
        type = 'QSP';
        break;
      case 'Others':
        type = 'Autre';
        break;
    }
  }

  return { status, type };
};
