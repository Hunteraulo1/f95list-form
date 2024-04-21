import { games } from "../data/game";
import sleep from "../sleep";

export interface DelGameArgs {
  name: string;
  version: string;
  comment?: string;
}

export const delGame = async ({
  name,
  version,
}: DelGameArgs): Promise<string | null> => {
  await sleep();

  let mockResponse = null;

  const game = games.find(
    (game) => game.name === name && game.version === version
  );

  mockResponse = game ? "success" : null;

  return JSON.parse(JSON.stringify(mockResponse));
};
