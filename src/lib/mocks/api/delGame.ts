import { games } from "../data/game";
import sleep from "../sleep";

export type GetGameArgs = {
  name: string | null;
  version: string | null;
};

/**
 * @param {GetGameArgs} [optionalArgs] - Required parameter containing name and version of game
 * @returns {Promise<string | null>}
 */
export async function delGame({
  name,
  version,
}: GetGameArgs): Promise<string | null> {
  await sleep();

  /** @type {Game | undefined} */
  let mockResponse = null;

  const game = games.find(
    (game) => game.name === name && game.version === version
  );

  mockResponse = game ? "success" : null;

  return JSON.parse(JSON.stringify(mockResponse));
}
