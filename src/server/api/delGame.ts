import { GameType } from "$types/schemas";
import { disableLock, enableLock } from "../lib/lockMode";
import { sendWebhookLogs, sendWebhookUpdate } from "../lib/webhook";
import { getGame } from "./getGame";
import { getQueryGames } from "./getQueryGames";
import { getUser } from "./getUser";
import { putUser } from "./putUser";

export interface DelGameArgs {
  query: { name: string; version: string };
  comment: string;
  silentMode: boolean;
}

export const delGame = async ({
  query,
  comment,
  silentMode,
}: DelGameArgs): Promise<void> => {
  const { name, version } = query;
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

      throw new Error("No detected getGame");
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet();

    const game: GameType = await getGame({ name, version });

    const gameSheet = sheet.getSheetByName("Jeux");

    if (!gameSheet) {
      console.error("No gameSheet detected");

      throw new Error("No gameSheet detected");
    }

    await gameSheet.deleteRow(gameIndex + 2);

    const user = await getUser();
    user.statistics.gameEdited++;

    putUser({ user });

    const { link, traductor, proofreader, image, tversion } = game;
    let title = "Suppression du jeu:";
    let color = 12256517;

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
  } catch (error) {
    console.error(error);

    throw new Error("Un problème est survenue lors de la suppression du jeu");
  } finally {
    await disableLock();
  }
};