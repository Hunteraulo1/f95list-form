import { QueryGamesType } from "../../../types/schemas";
import { queryGames } from "../data/game";
import sleep from "../sleep";

/**
 * @returns {Promise<QueryGamesType>}
 */
export async function getQueryGames(): Promise<QueryGamesType | null> {
  await sleep();

  return JSON.parse(JSON.stringify(queryGames));
}
