import { getQueryGames } from './getQueryGames';

import { Game, type GameType } from '$types/schemas';
import { games as gamesData } from '../data/game';

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

  const result = Game.parse(gamesData[gameIndex]);

  console.info('getGame ~ result:', result);

  return result;
};
