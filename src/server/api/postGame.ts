import { Game } from "../../types/schemas";
import { Game as GameType } from "../../types/types";
import { reloadFilter } from "../lib/reloadFilter";
import { getQueryGames } from "./getQueryGames";
import { getTraductors } from "./getTraductors";

/**
 * **API Endpoint** | Returns the accessing game object
 * @param {GameType} - Required parameter containing game name and version.
 * @returns {Promise<string>}
 */
export async function postGame(dataGame: GameType): Promise<string> {
  // Report request
  console.log("postGame called with args:", { dataGame });

  const validGame = Game.parse(dataGame); // prout

  const games = await getQueryGames();

  const gameIndex = games?.findIndex(
    (game) => game.name === validGame.name && game.version === validGame.version
  );

  if (gameIndex !== undefined && gameIndex === -1) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jeux");

    if (sheet) {
      const dataLink = async (data: string | null, domain: string) => {
        let result = "";

        if (data) {
          result = data;
          const traductors = await getTraductors();

          if (traductors) {
            for (let i = 0; i < traductors.length; i++) {
              const { name, links } = traductors[i];

              if (name === data && links && links.length > 0) {
                result = links[0].name;

                for (let il = 0; il < links.length; il++) {
                  result = `=HYPERLINK("${links[0].link}"; "${data}")`;

                  if (links[il].name === domain) {
                    return `=HYPERLINK("${links[il].link}"; "${data}")`;
                  }
                }
              }
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
      const totalRow = sheet.getLastRow();

      console.log("postGame convert:", { convertedGame });

      sheet.insertRowAfter(totalRow);
      const row = sheet.getRange(`A${totalRow + 1}:M${totalRow + 1}`);
      await row.setValues([convertedGame]);

      await sheet.sort(3, true);
      reloadFilter(sheet);
    } else {
      console.error("No gameSheet detected");
    }
  } else {
    console.error("Detect duplicate postGame with index:", { gameIndex });
    return "Un jeu existe déjà avec le même nom et version";
  }
  return "Un problème est survenu lors de l'ajout du jeu";
}
