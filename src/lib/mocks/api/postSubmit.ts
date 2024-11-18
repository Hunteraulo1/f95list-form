import sleep from '$lib/sleep';
import { games } from '../data/game';

import { Game, type PostSubmitType } from '$types/schemas';

export const postSubmit = async ({ game }: PostSubmitType): Promise<void> => {
  await sleep();

  const validGame = Game.parse(game);

  games.push(validGame);

  console.info('mockResponse_postSubmit', { validGame, games });
};
