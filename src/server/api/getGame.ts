import { GameType } from "../../types/schemas";
import { getQueryGames } from "./getQueryGames";

export interface GetGameArgs {
  name: string | null;
  version: string | null;
}

/**
 * **API Endpoint** | Returns the accessing game object
 * @param {GetGameArgs} [optionalArgs] - Optional parameter containing game name and version.
 * @returns {Promise<Game>}
 */
export async function getGame({
  name,
  version,
}: GetGameArgs): Promise<GameType | null> {
  // Report request
  console.log("getGame called with args:", { name, version });

  const games = await getQueryGames();

  const gameIndex = games?.findIndex(
    (game) => game.name === name && game.version === version
  );

  if (gameIndex && gameIndex !== -1) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet();
    const gameSheet = sheet.getSheetByName("Jeux");

    if (gameSheet) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: Array<any> = gameSheet
        .getRange(`A${gameIndex + 2}:M${gameIndex + 2}`)
        .getValues()[0];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dataLink: Array<any> = gameSheet
        .getRange(`C${gameIndex + 2}:J${gameIndex + 2}`)
        .getRichTextValues()[0];

      if (data) {
        return {
          id: data[0],
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
        };
      }
    }
  }

  return null;
}
