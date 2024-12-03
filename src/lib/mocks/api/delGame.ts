import { checkUser } from '../../../server/lib/utils';
import { disableLock, enableLock } from '../lockMode';
import { getQueryGames } from './getQueryGames';
import { getUser } from './getUser';
import { putUser } from './putUser';

export interface DelGameArgs {
  query: { name: string; version: string };
  comment: string;
  silentMode: boolean;
}

export const delGame = async ({ query, comment, silentMode }: DelGameArgs): Promise<void> => {
  console.info('delGame ~ args:', { query, comment, silentMode });

  const { name, version } = query;

  if (!checkUser('admin')) throw new Error('delGame ~ Unauthorized');

  enableLock();

  try {
    const games = (await getQueryGames()) ?? [];

    const gameIndex = games.findIndex((game) => game.name === name && game.version === version);

    if (gameIndex === -1) {
      console.error('delGame ~ No detected getGame with index:', { gameIndex });

      throw new Error('delGame ~ No detected getGame');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet();

    const gameSheet = sheet.getSheetByName('Jeux');

    if (!gameSheet) {
      console.error('delGame ~ No gameSheet detected');

      throw new Error('delGame ~ No gameSheet detected');
    }

    gameSheet.deleteRow(gameIndex + 2);

    const user = await getUser();
    user.statistics.gameEdited++;

    await putUser({ user });
  } catch (error) {
    console.error(error);

    throw new Error('delGame ~ Un problème est survenue lors de la suppression du jeu');
  } finally {
    disableLock();
  }
};
