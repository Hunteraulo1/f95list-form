import sleep from '$lib/sleep';
import { games } from '../data/game';

interface GetGameArgs {
  name: string | null;
  version: string | null;
}

export const getGame = async ({ name, version }: GetGameArgs) => {
  await sleep();

  const mockResponse = games.find((game) => game.name === name && game.version === version);

  return JSON.parse(JSON.stringify(mockResponse));
};
