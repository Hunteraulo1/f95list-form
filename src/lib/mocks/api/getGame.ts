import { games } from '../data/game';
import sleep from '../sleep';

export interface GetGameArgs {
  name: string | null;
  version: string | null;
}

export const getGame = async ({ name, version }: GetGameArgs) => {
  await sleep();

  const mockResponse = games.find((game) => game.name === name && game.version === version);

  return JSON.parse(JSON.stringify(mockResponse));
};
