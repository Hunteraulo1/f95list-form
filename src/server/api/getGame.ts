import { z } from "zod";
import { Game, GameType } from "../../types/schemas";
import { createGame_ } from "../lib/createGame_";
import { getGames } from "./getGames";

export type GetGameArgs = {
  name: string | null;
  version: string | null;
};

/**
 * **API Endpoint** | Returns the accessing game object
 * @param {GetGameArgs} [optionalArgs] - Optional parameter containing game name and version.
 * @returns {Promise<Game>}
 */
export async function getGame(
  { name, version }: GetGameArgs = { name: null, version: null }
): Promise<GameType | null> {
  // Report request
  console.log("getGame called with args:", { name, version });

  // Validate the arguments against the schema
  const GetUserArgsSchema = z.object({
    name: z.string(),
    version: z.string(),
  });

  const games = getGames();

  // Otherwise, the user object exists and we can return it.
  let game = games.find(
    (game: GameType) => game.name === name && game.version === version
  );

  if (!games) {
    let game = createGame_(Game.parse({}));
    return game;
  }

  return game;
}
