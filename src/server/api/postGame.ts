import { Game, type GameType } from "$types/schemas";
import { changelog } from "../lib/changeLog";
import { disableLock, enableLock } from "../lib/lockMode";
import { reloadFilter } from "../lib/reloadFilter";
import { sendWebhookLogs, sendWebhookUpdate } from "../lib/webhook";
import { getQueryGames } from "./getQueryGames";
import { getTraductors } from "./getTraductors";
import { getUser } from "./getUser";
import { putUser } from "./putUser";

export interface PostGameArgs {
  game: GameType;
  silentMode: boolean;
}

export const postGame = async ({
  game,
  silentMode,
}: PostGameArgs): Promise<void | string> => {
  // Report request
  console.info("postGame called with args:", { dataGame: game });

  try {
    enableLock();

    const validGame = await Game.parse(game);
    const games = await getQueryGames();

    const gameIndex = games?.findIndex(
      (game) =>
        game.name === validGame.name && game.version === validGame.version
    );

    if (gameIndex !== -1) {
      return "duplicate";
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jeux");

    if (!sheet) throw new Error("No gameSheet found");

    const dataLink = async (data: string | null, domain: string) => {
      let result = "";

      if (!data) return;

      result = data;
      const traductors = await getTraductors();

      if (!traductors) throw new Error("No traductors found");

      for (const { name, links } of traductors) {
        if (name !== data || !links?.length) continue;

        result = links[0].name;

        for (let index = 0; index < links.length; index++) {
          result = `=HYPERLINK("${links[0].link}"; "${data}")`;

          if (links[index].name === domain) {
            return `=HYPERLINK("${links[index].link}"; "${data}")`;
          }
        }
      }

      return result;
    };

    const convertedGame: string[] = [
      validGame.id ?? "",
      validGame.domain,
      `=HYPERLINK("${validGame.link}"; "${validGame.name}")`,
      validGame.version,
      validGame.tversion,
      validGame.tname.startsWith("Traduction")
        ? `=HYPERLINK("${validGame.tlink}"; "${validGame.tname}")`
        : validGame.tname,
      validGame.status,
      validGame.tags ?? "",
      validGame.type,
      (await dataLink(validGame.traductor, validGame.domain))?.toString() ?? "",
      (await dataLink(validGame.reader, validGame.domain))?.toString() ?? "",
      validGame.ttype,
      validGame.ac.toString(),
      validGame.image,
    ];
    const totalRow = await sheet.getLastRow();

    console.info("postGame convert:", { convertedGame });

    await sheet.insertRowAfter(totalRow);
    const row = await sheet.getRange(`A${totalRow + 1}:N${totalRow + 1}`);
    await row.setValues([convertedGame]);

    await sheet.sort(3, true);
    reloadFilter(sheet);

    changelog({ game: validGame.name, status: "AJOUT DE JEU" });

    const user = await getUser();
    user.statistics.gameAdded++;

    putUser({ user });

    let title = "Nouveau jeu ajouté:";
    let color = 115201;

    if (!silentMode) {
      sendWebhookUpdate({
        title,
        url: validGame.link,
        color,
        name: validGame.name,
        tversion: validGame.tversion,
        traductor: validGame.traductor,
        reader: validGame.reader,
        image: validGame.image,
      });
    }

    sendWebhookLogs({
      title,
      color,
      game: validGame,
    });
  } catch (error) {
    console.error(error);

    throw new Error("Un problème est survenue lors de l'ajout du jeu");
  } finally {
    disableLock();
  }
};
