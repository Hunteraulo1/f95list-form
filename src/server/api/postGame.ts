import { changelog } from '../lib/changeLog';
import { disableLock, enableLock } from '../lib/lockMode';
import { reloadFilter } from '../lib/reloadFilter';
import { sendWebhookLogs, sendWebhookUpdate } from '../lib/webhook';

import { getQueryGames } from './getQueryGames';
import { getTraductors } from './getTraductors';
import { getUser } from './getUser';
import { putStatistics, putUser } from './putUser';

import { Game } from '$types/schemas';
import { checkUser } from '../lib/utils';

import type { GameType } from '$types/schemas';

export interface PostGameArgs {
  game: GameType;
  silentMode: boolean;
}

export const postGame = async ({ game, silentMode }: PostGameArgs): Promise<undefined | string> => {
  console.info('postGame ~ args:', { game, silentMode });

  await checkUser('admin');

  try {
    enableLock();

    const validGame = Game.parse(game);
    const games = await getQueryGames();

    const duplicate = games?.findIndex(
      (game) => game.name.toLowerCase() === validGame.name.toLowerCase() && game.version === validGame.version,
    );

    if (duplicate !== -1) {
      return 'duplicate';
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Jeux');

    if (!sheet) throw new Error('No gameSheet found');

    const dataLink = async (data: string | null, domain: string): Promise<string | undefined> => {
      let result = '';

      if (!data) return;

      result = data;
      const traductors = await getTraductors();

      if (!traductors) throw new Error('No traductors found');

      for (const { name, links } of traductors) {
        if (name !== data || !links?.length) continue;

        result = links[0].name;

        for (let index = 0; index < links.length; index++) {
          result = `=HYPERLINK("${links[0].link}"; "${data}")`;

          if (links[index].name === domain) {
            return `=HYPERLINK("${links[index].link}"; "${data}")`;
          }
        }
      }

      return result;
    };

    const convertedGame: (string | number | null)[] = [
      validGame.id ?? null,
      validGame.domain,
      `=HYPERLINK("${validGame.link}"; "${validGame.name}")`,
      validGame.version,
      validGame.tversion,
      validGame.tname.startsWith('Traduction')
        ? `=HYPERLINK("${validGame.tlink}"; "${validGame.tname}")`
        : validGame.tname,
      validGame.status,
      validGame.tags ?? '',
      validGame.type,
      (await dataLink(validGame.traductor, validGame.domain))?.toString() ?? '',
      (await dataLink(validGame.proofreader, validGame.domain))?.toString() ?? '',
      validGame.ttype,
      validGame.ac.toString(),
      validGame.image,
    ];
    const totalRow = sheet.getLastRow();

    console.info('postGame convert:', { convertedGame });

    sheet.insertRowAfter(totalRow);
    const row = sheet.getRange(`A${totalRow + 1}:N${totalRow + 1}`);
    row.setValues([convertedGame]);

    await reloadFilter({ sheet, end: 'N', sort: 3 });

    changelog({ game: validGame.name, status: 'AJOUT DE JEU' });

    const user = await getUser();
    await putStatistics('post');

    await putUser({ user });

    if (!silentMode) {
      sendWebhookUpdate({
        title: 'Nouveau jeu ajouté:',
        url: validGame.link,
        color: 115_201,
        name: validGame.name,
        tversion: validGame.tversion,
        traductor: validGame.traductor,
        proofreader: validGame.proofreader,
        image: validGame.image,
      });
    }

    sendWebhookLogs({
      title: 'Nouveau jeu ajouté:',
      color: 115_201,
      game: validGame,
    });
  } catch (error) {
    console.error(error);

    throw new Error("Un problème est survenue lors de l'ajout du jeu");
  } finally {
    disableLock();
  }
};
