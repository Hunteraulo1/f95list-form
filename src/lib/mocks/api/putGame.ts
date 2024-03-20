import type { GameType } from "../../../types/schemas";
import { Game } from "../../../types/schemas";
import type { QueryGame } from "../../../types/types";
import { games } from "../data/game";
import sleep from "../sleep";
import { getGames } from "./getGames";

export interface PutGameArgs {
  game: GameType;
  query: QueryGame;
}

/**
 * **API Endpoint** | Updates the app configuration and returns it
 * @param {PutGameArgs} args
 * @returns {Promise<string>}
 */
export async function putGame({ game, query }: PutGameArgs) {
  await sleep();

  const gamesData = await getGames();

  if (gamesData) {
    const gameIndex = gamesData.findIndex(
      (g: GameType) => g.name === query.name && g.version === query.version
    );

    if (gameIndex !== -1) {
      const validGame = Game.parse(game);
      console.log("mockResponse_game", { validGame, games });

      return "success";
    } else {
      return Promise.reject("Le jeu est introuvable dans la liste");
    }
  } else {
    return Promise.reject("Impossible de récupérer la liste des jeux");
  }
}
