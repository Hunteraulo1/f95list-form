import { getQueryGames } from './getQueryGames';
import { getTraductors } from './getTraductors';

import { Game, type GameType } from '$types/schemas';
import checkUser from '../lib/checkUser';

export interface PostGameArgs {
  game: GameType;
}

export const postSubmit = async ({ game }: PostGameArgs): Promise<undefined | string> => {
  // Report request
  console.info('postSubmit called with args:', { dataGame: game });

  checkUser('traductor');

  try {
    const validGame = Game.parse(game);
    const games = await getQueryGames();

    const duplicate = games?.findIndex(
      (game) => game.name.toLowerCase() === validGame.name.toLowerCase() && game.version === validGame.version,
    );

    if (duplicate !== -1) {
      return 'duplicate';
    }

    const dataLink = async (data: string | null, domain: string) => {
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

    const convertedGame: string[] = [
      validGame.id ?? '',
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

    console.info('convertedGame', convertedGame);
  } catch (error) {
    console.error(error);

    throw new Error('Un problème est survenue lors de soumission du jeu');
  }
};
