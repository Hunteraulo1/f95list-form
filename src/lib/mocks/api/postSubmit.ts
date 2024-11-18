import sleep from '$lib/sleep';
import { games } from '../data/game';

import { Game, type GameType } from '$types/schemas';

export interface PostGameArgs {
  game: GameType;
}

export const postSubmit = async ({ game }: PostGameArgs): Promise<void> => {
  await sleep();

  const validGame = Game.parse(game);

  games.push(validGame);

  console.info('mockResponse_postSubmit', { validGame, games });
};
