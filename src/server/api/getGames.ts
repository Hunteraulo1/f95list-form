import { Game } from '$types/schemas';

import type { GameType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export const getGames = async (): Promise<GameType[]> => {
  console.info('getGames');

  isMaintenance();

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheet = sheet.getSheetByName('Jeux');
  const totalRow = gameSheet?.getLastRow();

  if (!gameSheet) throw new Error('getGames ~ No gameSheet detected');

  const data = gameSheet.getRange(`A2:N${totalRow}`).getValues();

  const result = data.map((game) =>
    Game.parse({
      id: Number(game[0]),
      domain: game[1],
      name: game[2],
      version: game[3],
      tversion: game[4],
      tname: game[5],
      status: game[6],
      tags: game[7],
      type: game[8],
      traductor: game[9],
      proofreader: game[10],
      ttype: game[11],
      ac: game[12],
      image: game[13],
      link: '',
      tlink: '',
      trlink: '',
    }),
  );

  console.info('getGames ~ result:', result);

  return result;
};
