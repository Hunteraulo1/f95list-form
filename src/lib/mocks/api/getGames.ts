import sleep from '$lib/sleep';
import type { GameType } from '../../../types/schemas';
import { games } from '../data/game';

export const getGames = async (): Promise<GameType[] | null> => {
  await sleep();

  return JSON.parse(JSON.stringify(games));
};
