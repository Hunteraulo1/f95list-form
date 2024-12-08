import { getQueryGames } from './getQueryGames';

import { Game, type GameType } from '$types/schemas';

export interface GetGameArgs {
  name: string | null;
  version: string | null;
}

export const getGame = async ({ name, version }: GetGameArgs): Promise<GameType> => {
  console.info('getGame ~ args:', { name, version });

  const games = await getQueryGames();

  const gameIndex = games?.findIndex((game) => game.name === name && game.version === version);

  if (gameIndex === undefined || gameIndex === -1) {
    console.error('getGame ~ No detected getQueryGames with index:', { gameIndex });
    throw new Error('getGame ~ No detected getQueryGames');
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheet = sheet.getSheetByName('Jeux');

  if (!gameSheet) {
    console.error('getGame ~ No gameSheet detected');
    throw new Error('getGame ~ No gameSheet detected');
  }

  const data = gameSheet.getRange(`A${gameIndex + 2}:N${gameIndex + 2}`).getValues()[0];
  const dataLink = gameSheet.getRange(`C${gameIndex + 2}:J${gameIndex + 2}`).getRichTextValues()[0];

  if (data[2] !== name || data[3] !== version) {
    console.error('getGame ~ No return getGame with args:', { name, version });
    throw new Error('getGame ~ No return getGame');
  }

  const result = Game.parse({
    id: Number(data[0]),
    domain: data[1],
    name: data[2],
    version: data[3],
    tversion: data[4],
    tname: data[5],
    status: data[6],
    tags: data[7],
    type: data[8],
    traductor: data[9],
    proofreader: data[10],
    ttype: data[11],
    ac: data[12],
    image: data[13], // TODO: ajouter les images
    link: dataLink[0]?.getLinkUrl() ?? '',
    tlink: dataLink[3]?.getLinkUrl() ?? '',
    trlink: dataLink[7]?.getLinkUrl() ?? '',
  });

  console.info('getGame ~ result:', result);

  return result;
};
