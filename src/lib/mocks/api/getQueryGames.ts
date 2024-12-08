import { QueryGame } from '$types/schemas';
import { queryGames } from '../data/game';

import type { QueryGameType } from '$types/schemas';

export const getQueryGames = async (): Promise<QueryGameType[]> => {
  console.info('getQueryGames');

  const data = queryGames;

  if (!data) throw new Error('getQueryGames ~ no return');

  const validQueryGames = data.map((query) => QueryGame.parse(query));

  console.info('getQueryGames ~ result:', validQueryGames);

  return validQueryGames;
};
