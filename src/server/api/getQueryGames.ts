import { QueryGameType } from "../../types/schemas";

/**
 * **API Endpoint** | Returns the accessing games array
 * @returns {Promise<QueryGame>}
 */
export async function getQueryGames(): Promise<QueryGameType[] | null> {
  // Report request
  console.log("getQueryGames called");

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const gameSheet = sheet.getSheetByName("Jeux");

  const totalRow = gameSheet?.getLastRow();
  const data = gameSheet?.getRange(`C2:D${totalRow}`).getValues();
  //const dataLink = gameSheet?.getRange(`C2:J${totalRow}`).getRichTextValues();

  const queryGames = data?.map((game: string[]) => ({
    name: game[0],
    version: game[1],
  }));

  return queryGames || null;
}
