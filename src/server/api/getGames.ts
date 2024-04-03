import { Game, GameType } from "../../types/schemas";

/**
 * **API Endpoint** | Returns the accessing game object
 * @returns {Promise<Game>}
 */
export async function getGames(): Promise<GameType[]> {
  // Report request
  console.log("getGames called");

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheet = sheet.getSheetByName("Jeux");
  const totalRow = gameSheet?.getLastRow();

  if (gameSheet) {
    const data = await gameSheet.getRange(`A2:M${totalRow}`).getValues();

    return data.map((game) =>
      Game.parse({
        id: game[0].toString(),
        domain: game[1],
        name: game[2],
        version: game[3],
        tversion: game[4],
        tname: game[5],
        status: game[6],
        tags: game[7],
        type: game[8],
        traductor: game[9],
        reader: game[10],
        ttype: game[11],
        ac: game[12],
        link: "",
        tlink: "",
        trlink: "",
      })
    );
  } else {
    console.error("No gameSheet detected");
  }
  console.error("Un problème est survenu lors de la récupération des jeux");

  return [];
}
