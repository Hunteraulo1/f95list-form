import { Game, GameType } from "../../types/schemas";
import { getQueryGames } from "./getQueryGames";

export interface GetGameArgs {
  name: string | null;
  version: string | null;
}

/**
 * **API Endpoint** | Returns the accessing game object
 * @param {GetGameArgs} - Required parameter containing game name and version.
 * @returns {Promise<Game | string>}
 */
export async function getGame({
  name,
  version,
}: GetGameArgs): Promise<GameType | string> {
  // Report request
  console.log("getGame called with args:", { name, version });

  const games = await getQueryGames();

  const gameIndex = games?.findIndex(
    (game) => game.name === name && game.version === version
  );

  if (gameIndex !== undefined && gameIndex !== -1) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const gameSheet = sheet.getSheetByName("Jeux");

    if (gameSheet) {
      const data = gameSheet
        .getRange(`A${gameIndex + 2}:M${gameIndex + 2}`)
        .getValues()[0];

      const dataLink = gameSheet
        .getRange(`C${gameIndex + 2}:J${gameIndex + 2}`)
        .getRichTextValues()[0];

      if (data[2] === name && data[3] === version) {
        return Game.parse({
          id: data[0].toString(),
          domain: data[1],
          name: data[2],
          version: data[3],
          tversion: data[4],
          tname: data[5],
          status: data[6],
          tags: data[7],
          type: data[8],
          traductor: data[9],
          reader: data[10],
          ttype: data[11],
          ac: data[12],
          link: dataLink ? dataLink[0]?.getLinkUrl() : "",
          tlink: dataLink ? dataLink[3]?.getLinkUrl() : "",
          trlink: dataLink ? dataLink[7]?.getLinkUrl() : "",
        });
      } else {
        console.error("No return getGame with args:", { name, version });
      }
    } else {
      console.error("No gameSheet detected");
    }
  } else {
    console.error("No detected getGame with index:", { gameIndex });
  }
  return "Un problème est survenu lors de la récupération du jeu";
}
