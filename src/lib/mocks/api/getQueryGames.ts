import type { QueryGameType } from '../../../types/schemas';
import { queryGames } from '../data/game';
import sleep from '../sleep';

export const getQueryGames = async (): Promise<QueryGameType[] | null> => {
  await sleep();

  return JSON.parse(JSON.stringify(queryGames));
};
