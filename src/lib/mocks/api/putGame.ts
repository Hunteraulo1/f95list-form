import { Game, GameType, QueryGameType } from "$types/schemas";
import { games } from "../data/game";
import sleep from "../sleep";
import { getGames } from "./getGames";

export interface PutGameArgs {
  game: GameType;
  query: QueryGameType;
}

export const putGame = async ({ game, query }: PutGameArgs) => {
  await sleep();

  try {
    const gamesData = await getGames();

    if (!gamesData) {
      return Promise.reject("Impossible de récupérer la liste des jeux");
    }

    const gameIndex = gamesData.findIndex(
      (g: GameType) => g.name === query.name && g.version === query.version
    );

    if (gameIndex === -1) {
      return Promise.reject("Le jeu est introuvable dans la liste");
    }

    const validGame = Game.parse(game);
    console.info("mockResponse_game", { validGame, games });

    return "success";
  } catch (error) {
    console.error("putGame: " + error);
  }
};
