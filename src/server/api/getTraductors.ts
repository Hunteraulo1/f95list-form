import type { Traductor } from "../../types/types";

/**
 * **API Endpoint** | Returns the accessing game object
 * @returns {Promise<Traductor[] | null>}
 */
export async function getTraductors(): Promise<Traductor[] | null> {
  // Report request
  console.log("getTraductors called");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Traducteurs/Relecteurs"
  );
  const totalRow = sheet?.getLastRow();

  let result;

  if (sheet) {
    const data = sheet.getRange(`A${2}:B${totalRow}`).getRichTextValues();

    result = data.map((tr) => {
      return {
        name: tr[0]?.getText() || "",
        links: tr[3]
          ?.getRuns()
          .filter((trl) => trl.getLinkUrl())
          .map((trl) => ({
            name: trl.getText(),
            link: trl.getLinkUrl() || "",
          })),
      };
    });
  }

  return result || null;
}
