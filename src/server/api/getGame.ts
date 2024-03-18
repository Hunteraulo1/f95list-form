import { GameType } from "../../types/schemas";
import { getQueryGames } from "./getQueryGames";

export type GetGameArgs = {
  name: string | null;
  version: string | null;
};

/**
 * **API Endpoint** | Returns the accessing game object
 * @param {GetGameArgs} [optionalArgs] - Optional parameter containing game name and version.
 * @returns {Promise<Game>}
 */
export async function getGame({
  name,
  version,
}: GetGameArgs): Promise<GameType | null> {
  // Report request
  console.log("getGame called with args:", { name, version });

  const games = await getQueryGames();

  const game = games?.find(
    (game) => game.name === name && game.version === version,
  );

  return game as GameType;
}
