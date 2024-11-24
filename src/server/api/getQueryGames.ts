import type { QueryGameType } from '$types/schemas';

export const getQueryGames = async (): Promise<QueryGameType[]> => {
  console.groupCollapsed('getQueryGames');

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheet = sheet.getSheetByName('Jeux');

  const totalRow = gameSheet?.getLastRow();
  const data = gameSheet?.getRange(`A2:D${totalRow}`).getValues();

  if (!data) throw new Error('getQueryGames no return');

  const result = data.map(([id, , name, version]) => ({ id, name, version }));

  console.info('result:', result);

  console.groupEnd();

  return result;
};
