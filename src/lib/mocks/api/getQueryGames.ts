import { QueryGameType } from "../../../types/schemas";
import { queryGames } from "../data/game";
import sleep from "../sleep";

/**
 * @returns {Promise<QueryGameType[]>}
 */
export async function getQueryGames(): Promise<QueryGameType[] | null> {
  await sleep();

  return JSON.parse(JSON.stringify(queryGames));
}
