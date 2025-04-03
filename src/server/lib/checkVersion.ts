import { getGames } from '../api/getGames';
import { getScrape } from '../api/getScrape';
import { F95host } from '../env';
import { sendTraductorWebhook, sendWebhookAC, sendWebhookUpdate } from './webhook';

import type { GameACType, GameType } from '$types/schemas';
import { delTraductor } from '../api/delTraductor';
import { getTraductorsCalc } from '../api/getTraductors';
import { changelog } from './changeLog';

const checkVersion = async (): Promise<void> => {
  console.info('checkVersion');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Jeux');

  const ids: number[] = [];
  const games: GameType[] = await getGames();
  const checkedGames: {
    index: number;
    id: number;
    version: string;
    traductor: string;
    name: string;
    tname: string;
    link: string;
    proofreader: string;
    image: string;
  }[] = [];
  let result: { [key: string]: string } = {};
  const changed: GameACType[] = [];

  games.forEach((game, index) => {
    const { domain, id, ac, version, traductor, name, tname, link, image, proofreader } = game;

    if (domain !== 'F95z' || !id || !ac) return;

    ids.push(id);
    checkedGames.push({ index, id, version, traductor, name, tname, link, image, proofreader });
  });

  for (let index = 0; index <= ids.length / 100; index++) {
    const data = await f95Api(ids.slice(index * 100, index * 100 + 100).toString());

    console.info({ index, data });

    if (data.status === 'ok') {
      result = Object.assign(result, data.msg);
    } else if (data.status === 'error') {
      console.error(data.msg);
    } else {
      console.error(data.status);
    }
  }

  for (const game of checkedGames) {
    const { index, id, version, traductor, name, tname, link, image, proofreader } = game;
    if (version === result[id]) {
      // console.info(`ID: ${id} | version: ${version} / newVersion: ok`);
    } else if (result[id] === 'Unknown') {
      console.info(`ID: ${id} | Unknown version`);
    } else if (result[id] !== undefined) {
      console.info(`ID: ${id} | version: ${version} > newVersion: ${result[id]}`);

      const rowId = sheet?.getRange(`A${index + 2}`)?.getValue();
      sheet?.getRange(`D${index + 2}`).setValue(result[id]);

      if (rowId === id) {
        try {
          const resultScrape = await getScrape({ domain: 'F95z', id });
          console.info('🚀 ~ checkedGames.forEach ~ resultScrape:', resultScrape);

          const range = sheet?.getRange(`G${index + 2}:I${index + 2}`);

          if (!range) return;

          const oldValue = range.getValues();

          range.setValues([
            [
              resultScrape.status ?? oldValue[0][1],
              resultScrape.tags ?? oldValue[0][1],
              resultScrape.type ?? oldValue[0][1],
            ],
          ]);

          if (result?.image === '') throw new Error('no image scraped');

          sheet?.getRange(`N${index + 2}`)?.setValue(resultScrape.image);

          if (tname === 'Intégrée') {
            sendWebhookUpdate({
              title: 'Traduction mise à jour:',
              url: link,
              color: 5_814_783,
              name,
              tversion: `${version} > ${result[id]}`,
              traductor,
              proofreader,
              image,
            });

            changelog({ game: name, status: 'MISE À JOUR' });
          }
        } catch (error) {
          console.error('scrape image error: ', error);
        }
        changed.push({ id, version, newVersion: result[id], traductor, name });
      } else {
        console.error({ rowId, id, version });
      }
    }
  }

  checkTraductors();

  sendWebhookAC({ games: changed });

  sendTraductorWebhook({ games: changed });
};

interface Response {
  status: string;
  msg: {
    [key: string]: string;
  };
}

const f95Api = async (ids: string | string[]): Promise<Response> => {
  console.info('f95Api ~ args:', { ids });

  const url = `${F95host}/sam/checker.php?threads=${ids}`;
  const response = await UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  const json = response.getContentText();

  const result = JSON.parse(json) as Response;

  console.info('f95Api ~ result:', result);

  return result;
};

const checkTraductors = async (): Promise<void> => {
  const traductors = await getTraductorsCalc();

  for (const traductor of traductors) {
    if (traductor.calc !== 0) continue;
    delTraductor({ query: traductor.name });
  }
};
