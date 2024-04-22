import { Game, type GameType } from "$types/schemas";
import { games } from "../data/game";
import sleep from "../sleep";
import { sendWebhookLogs, sendWebhookUpdate } from "../webhook";

export interface PostGameArgs {
  game: GameType;
  silentMode: boolean;
}

export const postGame = async ({
  game,
  silentMode,
}: PostGameArgs): Promise<void | string> => {
  await sleep();

  const validGame = Game.parse(game);

  games.push(validGame);

  console.info("mockResponse_postGame", { validGame, games });

  let title = "Suppression du jeu:";
  let color = 12256517;

  const { link, name, tversion, traductor, reader, image } = validGame;

  if (!silentMode) {
    sendWebhookUpdate({
      title,
      url: link,
      color,
      name,
      tversion,
      traductor,
      reader,
      image,
    });
  }

  sendWebhookLogs({
    title,
    color,
    game,
  });
};
