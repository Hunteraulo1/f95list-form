import { changelog } from '../lib/changeLog';
import { disableLock, enableLock } from '../lib/lockMode';
import { reloadFilter } from '../lib/reloadFilter';
import { sendWebhookLogs, sendWebhookUpdate } from '../lib/webhook';

import { getGame } from './getGame';
import { getQueryGames } from './getQueryGames';
import { getTraductors } from './getTraductors';
import { getUser } from './getUser';
import { putStatistics, putUser } from './putUser';

import type { GameType } from '$types/schemas';
import { Game } from '$types/schemas';
import { checkUser } from '../lib/utils';

export interface PutGameArgs {
  game: GameType;
  query: {
    name: string | null;
    version: string | null;
  };
  silentMode: boolean;
}

export const putGame = async ({ game: dataGame, query, silentMode }: PutGameArgs): Promise<undefined | string> => {
  console.info('putGame ~ args:', { dataGame });

  checkUser('admin');

  try {
    enableLock();

    const validGame = Game.parse(dataGame);

    const games = await getQueryGames();

    if (query.name !== dataGame.name || query.version !== dataGame.version) {
      const duplicateGame = games?.findIndex(
        (oldGame) => oldGame.name === dataGame.name && oldGame.version === dataGame.version,
      );

      if (duplicateGame !== -1) {
        return 'duplicate';
      }
    }

    const gameIndex = games?.findIndex((oldGame) => oldGame.name === query.name && oldGame.version === query.version);

    if (gameIndex === undefined || gameIndex === -1) {
      console.error('putGame ~ No detect game with index:', { gameIndex });
      throw new Error('putGame ~ Impossible de trouver le jeu dans la liste');
    }

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
      (await dataLink(validGame.traductor, validGame.domain)).toString(),
      (await dataLink(validGame.proofreader, validGame.domain)).toString(),
      validGame.ttype,
      validGame.ac.toString(),
      validGame.image,
    ];

    const oldGame: GameType = await getGame(query);

    console.info('putGame ~ convert:', { convertedGame });

    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const gameSheet = sheet.getSheetByName('Jeux');

    if (!gameSheet) {
      console.error({ gameSheet });
      throw new Error('putGame ~ Une erreur est survenue !');
    }

    const row = gameSheet.getRange(`A${gameIndex + 2}:N${gameIndex + 2}`);
    row.setValues([convertedGame]);

    await reloadFilter({ sheet: gameSheet, end: 'N', sort: 3 });

    if (validGame.tversion !== oldGame.tversion) {
      changelog({ game: validGame.name, status: 'MISE À JOUR' });
    }

    const user = await getUser();
    await putStatistics('put');

    await putUser({ user });

    let title = "Modification d'un jeu";
    let color = 5_814_783;

    if (!silentMode) {
      if (validGame.tlink !== oldGame.tlink && validGame.tlink === 'n/a') {
        title = 'Traduction manquante';
        color = 12_256_517;

        webhookUpdate(oldGame, validGame, title, color);
      } else if (validGame.tversion !== oldGame.tversion) {
        title = 'Traduction mise à jour:';

        webhookUpdate(oldGame, validGame, title, color);
      } else if (validGame.tlink !== oldGame.tlink) {
        title = "Mise à jour d'un lien de traduction:";
        color = 15_122_688;

        webhookUpdate(oldGame, validGame, title, color);
      }
    }

    sendWebhookLogs({
      title,
      color,
      oldGame,
      game: validGame,
    });
  } catch (error) {
    console.error(error);

    throw new Error('putGame ~ Un problème est survenue lors de modification du jeu');
  } finally {
    disableLock();
  }
};

const dataLink = async (data: string | null, domain: string): Promise<string> => {
  console.info('dataLink ~ args:', { data, domain });

  if (!data) return '';

  const traductors = await getTraductors();

  if (!traductors) {
    console.error({ traductors });
    throw new Error('dataLink ~ Une erreur est survenue !');
  }

  let result = data;

  for (const traductor of traductors) {
    const { name, links } = traductor;

    if (name === data && links && links.length > 0) {
      result = links[0].name;

      for (let il = 0; il < links.length; il++) {
        result = `=HYPERLINK("${links[0].link}"; "${data}")`;

        if (links[il].name === domain) {
          return `=HYPERLINK("${links[il].link}"; "${data}")`;
        }
      }
    }
  }

  console.info('dataLink ~ result:', result);

  return result;
};

const webhookUpdate = (oldGame: GameType, validGame: GameType, title: string, color: number): void => {
  console.info('webhookUpdate ~ args:', { oldGame, validGame, title, color });

  sendWebhookUpdate({
    title,
    url: validGame.link,
    color,
    name: validGame.name,
    tversion:
      oldGame.tversion === validGame.tversion ? validGame.tversion : `${oldGame.tversion} > ${validGame.tversion}`,
    traductor:
      oldGame.traductor === validGame.traductor ? validGame.traductor : `${oldGame.traductor} > ${validGame.traductor}`,
    proofreader:
      oldGame.proofreader === validGame.proofreader
        ? validGame.proofreader
        : `${oldGame.proofreader} > ${validGame.proofreader}`,
    image: validGame.image,
  });
};
