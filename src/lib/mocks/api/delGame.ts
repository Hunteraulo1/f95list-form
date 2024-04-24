import { games } from "../data/game";
import sleep from "../sleep";
import { sendWebhookLogs, sendWebhookUpdate } from "../webhook";

export interface DelGameArgs {
  query: { name: string; version: string };
  comment?: string;
  silentMode: boolean;
}

export const delGame = async ({ query, comment, silentMode }: DelGameArgs): Promise<void> => {
  await sleep();

  const { name, version } = query;

  const game = games.find((game) => game.name === name && game.version === version);

  if (!game) throw new Error("delGame game not found");

  console.info("mockResponse_delGame", { query, comment, silentMode, games });

  const title = "Suppression du jeu:";
  const color = 12256517;

  const { link, tversion, traductor, proofreader, image } = game;

  if (!silentMode) {
    sendWebhookUpdate({
      title,
      url: link,
      color,
      comment,
      name,
      tversion,
      traductor,
      proofreader,
      image,
    });
  }

  sendWebhookLogs({
    title,
    color,
    game,
  });
};
