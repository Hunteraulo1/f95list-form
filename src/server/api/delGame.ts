import { disableLock, enableLock } from '../lib/lockMode';
import { checkUser } from '../lib/utils';
import { sendWebhookLogs, sendWebhookUpdate } from '../lib/webhook';
import { getGame } from './getGame';
import { getQueryGames } from './getQueryGames';
import { getUser } from './getUser';
import { putUser } from './putUser';

import type { GameType } from '$types/schemas';

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
      console.error('delGame ~ No detected getQueryGames with index:', { gameIndex });

      throw new Error('delGame ~ No detected getQueryGames');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet();

    const game: GameType = await getGame({ name, version });

    const gameSheet = sheet.getSheetByName('Jeux');

    if (!gameSheet) {
      console.error('delGame ~ No gameSheet detected');

      throw new Error('delGame ~ No gameSheet detected');
    }

    gameSheet.deleteRow(gameIndex + 2);

    const user = await getUser();
    user.statistics.gameEdited++;

    await putUser({ user });

    const { link, traductor, proofreader, image, tversion } = game;

    if (!silentMode) {
      sendWebhookUpdate({
        title: 'Suppression du jeu:',
        url: link,
        color: 12_256_517,
        comment,
        name,
        tversion,
        traductor,
        proofreader,
        image,
      });
    }

    sendWebhookLogs({
      title: 'Suppression du jeu:',
      color: 12_256_517,
      game,
      comment,
    });
  } catch (error) {
    console.error(error);

    throw new Error('delGame ~ Un problème est survenue lors de la suppression du jeu');
  } finally {
    disableLock();
  }
};
