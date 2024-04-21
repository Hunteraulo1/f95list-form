import { Game, type GameType } from "$types/schemas";
import { games } from "../data/game";
import sleep from "../sleep";

export interface PostGameArgs {
  game: GameType;
}

export const postGame = async ({ game }: PostGameArgs) => {
  await sleep();

  const validGame = Game.parse(game);

  games.push(validGame);

  console.info("mockResponse_game", { validGame, games });

  return "success";
};
