import { Game, type GameType } from "$types/schemas";
import { changelog } from "../lib/changeLog";
import { disableLock, enableLock } from "../lib/lockMode";
import { reloadFilter } from "../lib/reloadFilter";
import { sendWebhookLogs, sendWebhookUpdate } from "../lib/webhook";
import { getQueryGames } from "./getQueryGames";
import { getTraductors } from "./getTraductors";

export interface PostGameArgs {
  game: GameType;
}

export const postGame = async ({ game }: PostGameArgs): Promise<string> => {
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
      return "Le jeu existe déjà dans la liste";
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jeux");

    if (!sheet) return "No gameSheet found";

    const dataLink = async (data: string | null, domain: string) => {
      let result = "";

      if (!data) return "No data found";

      result = data;
      const traductors = await getTraductors();

      if (!traductors) return "No traductors found";

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
      validGame.id || "",
      validGame.domain,
      `=HYPERLINK("${validGame.link}"; "${validGame.name}")`,
      validGame.version,
      validGame.tversion,
      validGame.tname.startsWith("Traduction")
        ? `=HYPERLINK("${validGame.tlink}"; "${validGame.tname}")`
        : validGame.tname,
      validGame.status,
      validGame.tags || "",
      validGame.type,
      (await dataLink(validGame.traductor, validGame.domain)).toString(),
      (await dataLink(validGame.reader, validGame.domain)).toString(),
      validGame.ttype,
      validGame.ac.toString(),
    ];
    const totalRow = await sheet.getLastRow();

    console.info("postGame convert:", { convertedGame });

    await sheet.insertRowAfter(totalRow);
    const row = await sheet.getRange(`A${totalRow + 1}:M${totalRow + 1}`);
    await row.setValues([convertedGame]);

    await sheet.sort(3, true);
    reloadFilter(sheet);

    changelog({ game: validGame.name, status: "AJOUT DE JEU" });

    let title = "Nouveau jeu ajouté:";
    let color = 115201;

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

    sendWebhookLogs({
      title,
      color,
      game: validGame,
    });

    return "success";
  } catch (error) {
    console.error(error);

    return "Un problème est survenue lors de l'ajout du jeu";
  } finally {
    disableLock();
  }
};
