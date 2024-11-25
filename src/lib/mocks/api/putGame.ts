import { getGame } from './getGame';
import { getQueryGames } from './getQueryGames';
import { getTraductors } from './getTraductors';
import { getUser } from './getUser';
import { putUser } from './putUser';

import type { GameType } from '$types/schemas';
import { Game } from '$types/schemas';
import { checkUser } from '../../../server/lib/utils';
import { disableLock, enableLock } from '../lockMode';

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
      console.error('No detect game putGame with index:', { gameIndex });
      throw new Error('Impossible de trouver le jeu dans la liste');
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

    console.info('putGame convert:', { convertedGame });

    const user = getUser();
    // putStatistics('put');

    putUser({ user });
  } catch (error) {
    console.error(error);

    throw new Error('Un problème est survenue lors de modification du jeu');
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
    throw new Error('Une erreur est survenue !');
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
