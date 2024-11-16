import { getGames } from '../api/getGames';
import { getScrape } from '../api/getScrape';

import { sendTraductorWebhook, sendWebhookAC } from './webhook';

import type { GameACType } from '$types/schemas';

const checkVersion = async () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Jeux');

  const ids: string[] = [];
  const games = await getGames();
  const checkedGames: { index: number; id: string; version: string; traductor: string; name: string }[] = [];
  let result: { [key: string]: string } = {};
  const changed: GameACType[] = [];

  games.forEach((game, index) => {
    const { domain, id, ac, version, traductor, name } = game;

    if (domain === 'F95z' && id && ac) {
      ids.push(game.id);
      checkedGames.push({ index, id, version, traductor, name });
    }
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
    const { index, id, version, traductor, name } = game;
    if (version === result[id]) {
      // console.info(`ID: ${id} | version: ${version} / newVersion: ok`);
    } else if (result[id] === 'Unknown') {
      console.info(`ID: ${id} | Unknown version`);
    } else if (result[id] !== undefined) {
      console.info(`ID: ${id} | version: ${version} > newVersion: ${result[id]}`);

      const rowId = sheet?.getRange(`A${index + 2}`)?.getValue();
      sheet?.getRange(`D${index + 2}`).setValue(result[id]);

      if (rowId === Number.parseInt(id)) {
        try {
          const resultScrape = await getScrape({ domain: 'F95z', id });
          console.info('🚀 ~ checkedGames.forEach ~ resultScrape:', resultScrape);

          sheet
            ?.getRange(`G${index + 2}:I${index + 2}`)
            ?.setValues([[resultScrape.status, resultScrape.tags, resultScrape.type]]);

          if (result?.image === '') throw new Error('no image scraped');

          sheet?.getRange(`N${index + 2}`)?.setValue(resultScrape.image);
        } catch (error) {
          console.error('scrape image error: ', error);
        }
        changed.push({ id, version, newVersion: result[id], traductor, name });
      } else {
        console.error({ rowId, id, version });
      }
    }
  }

  sendWebhookAC({ games: changed });

  sendTraductorWebhook({ games: changed });
};

const host = 'https://f95zone.to';

const f95Api = async (ids: string | string[]) => {
  interface Response {
    status: string;
    msg: {
      [key: string]: string;
    };
  }

  const url = `${host}/sam/checker.php?threads=${ids}`;
  const response = await UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  const json = response.getContentText();

  return JSON.parse(json) as Response;
};
