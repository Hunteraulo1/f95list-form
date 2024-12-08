import { Game } from '$types/schemas';
import { disableLock, enableLock } from '../lockMode';
import { checkUser } from '../utils';
import { getQueryGames } from './getQueryGames';
import { getTraductors } from './getTraductors';
import { getUser } from './getUser';
import { putStatistics, putUser } from './putUser';

import type { GameType } from '$types/schemas';

export interface PostGameArgs {
  game: GameType;
  silentMode: boolean;
}

export const postGame = async ({ game, silentMode }: PostGameArgs): Promise<undefined | string> => {
  console.info('postGame ~ args:', { game, silentMode });

  if (!(await checkUser('admin'))) throw new Error('postGame ~ Unauthorized');

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

    const dataLink = async (data: string | null, domain: string): Promise<string | undefined> => {
      let result = '';

      if (!data) return;

      result = data;
      const traductors = await getTraductors();

      if (!traductors) throw new Error('postGame ~ No traductors found');

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

    console.info('postGame ~ convert:', { convertedGame });

    const user = await getUser();
    await putStatistics('post');

    await putUser({ user });
  } catch (error) {
    console.error(error);

    throw new Error("postGame ~ Un problème est survenue lors de l'ajout du jeu");
  } finally {
    disableLock();
  }
};
