import { GameType } from "../../../types/schemas";
import { game, games } from "../data/game";
import sleep from "../sleep";

export type GetGameArgs = {
  name: string | null;
  version: string | null;
};

/**
 * @param {GetGameArgs} [optionalArgs] - Required parameter containing name and version of game
 * @returns {Promise<GameType>}
 */
export async function getGame({
  name,
  version,
}: GetGameArgs): Promise<GameType | null> {
  await sleep();

  /** @type {Game | undefined} */
  let mockResponse = null;

  if (!name && !version) {
    mockResponse = game;
  } else {
    const game = games.find(
      (game) => game.name === name && game.version === version,
    );
    if (game) {
      mockResponse = game;
    }
  }

  return JSON.parse(JSON.stringify(mockResponse));
}
