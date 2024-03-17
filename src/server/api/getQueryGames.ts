import { QueryGames, QueryGamesType } from "../../types/schemas";
import { createGames_ } from "../lib/createGame_";

/**
 * **API Endpoint** | Returns the accessing games array
 * @returns {Promise<QueryGames>}
 */
export async function getQueryGames(): Promise<QueryGamesType[] | null> {
  // Report request
  console.log("getQueryGames called");

  //const sheet = SpreadsheetApp.getActiveSpreadsheet();
  ///const gameSheet = sheet.getSheetByName("Jeux");

  //const totalRow = gameSheet?.getLastRow();
  //const data = gameSheet?.getRange(`A2:M${totalRow}`).getValues();
  //const dataLink = gameSheet?.getRange(`C2:J${totalRow}`).getRichTextValues();

  let queryGames; /*= data?.map((game: string[], i) => ({
    name: game[2],
    version: game[3],
  }));*/

  if (!queryGames) {
    let result = [];
    for (let i = 0; i < 10; i++) {
      result.push(createGames_(QueryGames.parse({})));
    }
    return result;
  }

  return queryGames;
}
