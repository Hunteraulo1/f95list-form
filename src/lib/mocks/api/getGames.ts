import { GameType } from "../../../types/schemas";
import { games } from "../data/game";
import sleep from "../sleep";

/**
 * @returns {Promise<GameType[]>}
 */
export async function getGames(): Promise<GameType[] | null> {
  await sleep();

  return JSON.parse(JSON.stringify(games));
}
