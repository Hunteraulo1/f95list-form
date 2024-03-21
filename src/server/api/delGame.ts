import { getQueryGames } from "./getQueryGames";

interface delGameArgs {
  name: string;
  version: string;
  comment: string;
}

/**
 * @param {delGameArgs} - Required parameter containing id of game
 * @returns {Promise<string>}
 */
export async function delGame({
  name,
  version,
  comment,
}: delGameArgs): Promise<string | null> {
  // Report request
  console.log("delGame called with args:", { name, version, comment });

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

      if ((data[2] === name, data[3] === version)) {
        await gameSheet.deleteRow(gameIndex + 2);
        return "success";
      } else {
        console.error("No equal values for delGame:", data[2], data[3], {
          name,
          version,
        });
      }
    } else {
      console.error("No gameSheet detected");
    }
  } else {
    console.error("No detected getGame with index:", { gameIndex });
  }

  return null;
}
