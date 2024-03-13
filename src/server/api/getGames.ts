import { Game, GamesType } from "../../types/schemas";
import { createGame_ } from "../lib/createGame_";

/**
 * **API Endpoint** | Returns the accessing games array
 * @returns {Promise<Games>}
 */
export async function getGames(): Promise<GamesType | null> {
  // Report request
  console.log("getGames called");

  //const sheet = SpreadsheetApp.getActiveSpreadsheet();
  ///const gameSheet = sheet.getSheetByName("Jeux");

  //const totalRow = gameSheet?.getLastRow();
  //const data = gameSheet?.getRange(`A2:M${totalRow}`).getValues();
  //const dataLink = gameSheet?.getRange(`C2:J${totalRow}`).getRichTextValues();

  let games; /*= data?.map((game: string[], i) => ({
    id: parseInt(game[0]),
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
    link: "", //dataLink?[i][0].getLinkUrl(),
    tlink: "", //dataLink?[i][3].getLinkUrl()
  }));*/

  if (!games) {
    let result = [];
    for (let i = 0; i < 10; i++) {
      result.push(createGame_(Game.parse({})));
    }
    return result;
  }

  return games;
}
