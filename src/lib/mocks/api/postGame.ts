import { Game } from "../../../types/schemas";
import { Game as DataGame } from "../../../types/types";
import { games } from "../data/game";
import sleep from "../sleep";

/**
 * **API Endpoint** | Updates the app configuration and returns it
 * @param {DataGame} args
 * @returns {Promise<string>}
 */
export async function postGame(game: DataGame) {
  await sleep();

  const validGame = Game.parse(game);

  games.push(validGame);

  console.log("mockResponse_game", { validGame, games });

  return "success";
}
