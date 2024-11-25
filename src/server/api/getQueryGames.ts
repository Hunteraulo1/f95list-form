import { QueryGame } from '$types/schemas';

import type { QueryGameType } from '$types/schemas';

export const getQueryGames = async (): Promise<QueryGameType[]> => {
  console.info('getQueryGames');

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheet = sheet.getSheetByName('Jeux');

  const totalRow = gameSheet?.getLastRow();
  const data = gameSheet?.getRange(`A2:D${totalRow}`).getValues();

  if (!data) throw new Error('getQueryGames ~ no return');

  const validQueryGames = data.map(([id, , name, version]) => QueryGame.parse({ id, name, version }));

  console.info('getQueryGames ~ result:', validQueryGames);

  return validQueryGames;
};
