import { GameType } from "$types/schemas";
import { disableLock, enableLock } from "../lib/lockMode";
import { sendWebhookLogs, sendWebhookUpdate } from "../lib/webhook";
import { getGame } from "./getGame";
import { getQueryGames } from "./getQueryGames";

export interface DelGameArgs {
  name: string;
  version: string;
  comment: string;
}

export const delGame = async ({
  name,
  version,
  comment,
}: DelGameArgs): Promise<string> => {
  // Report request
  console.info("delGame called with args:", { name, version, comment });

  await enableLock();

  try {
    const games = (await getQueryGames()) ?? [];

    const gameIndex = games.findIndex(
      (game) => game.name === name && game.version === version
    );

    if (gameIndex === -1) {
      console.error("No detected getGame with index:", { gameIndex });

      return "No detected getGame";
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet();

    const game: GameType = await getGame({ name, version });

    const gameSheet = sheet.getSheetByName("Jeux");

    if (!gameSheet) {
      console.error("No gameSheet detected");

      return "No gameSheet detected";
    }

    await gameSheet.deleteRow(gameIndex + 2);

    const { link, traductor, reader, image, tversion } = game;
    let title = "Suppression du jeu:";
    let color = 12256517;

    sendWebhookUpdate({
      title,
      url: link,
      color,
      comment,
      name,
      tversion,
      traductor,
      reader,
      image,
    });

    sendWebhookLogs({
      title,
      color,
      game,
    });

    return "success";
  } catch (error) {
    console.error(error);

    return "Un problème est survenue lors de la suppression du jeu";
  } finally {
    await disableLock();
  }
};
