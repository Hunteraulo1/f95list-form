import { getFetchF95z } from './getFetchF95z';

import { type GameType, ScrapeGame } from '$types/schemas';

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

  if (domain !== 'F95z') throw new Error('domaine incompatible');

  const link = `https://f95zone.to/threads/${id}`;
  const regName = /.*-\s(.*?)\s\[/i;
  const regTitle = /([\w\\']+)(?=\s-)/gi;

  const response = UrlFetchApp.fetch(link, {
    muteHttpExceptions: true,
  });
  const $ = Cheerio.load(response.getContentText());
  const tags = $('.tagItem')
    .map((_, tag) => $(tag).text().trim())
    .get()
    .join(', ');
  const title = $('title').text();
  const img = $('img.bbImage').attr('src');

  const image = img?.replace('thumb/', '') ?? '';

  const titleMatch = title.match(regTitle) ?? [];
  const nameMatch = title.match(regName) ?? [];

  const name = nameMatch?.[1] ?? '';
  const { status, type } = scrapeGetTitle(titleMatch);

  let version = '';

  try {
    const result = await getFetchF95z(id);

    console.info({ result });

    version = result ?? '';
  } catch (error) {
    console.error('Error getFetchF95z: ', error);
    throw new Error('getFetchF95z no return');
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

  console.info('validScrapeGame:', validScrapeGame);

  return validScrapeGame;
};

const scrapeGetTitle = (data: string[]): { status: string; type: string } => {
  let status = '';
  let type = '';

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
      case 'Unreal':
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
