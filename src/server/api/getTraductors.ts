import type { TraductorType } from "$types/schemas";

export const getTraductors = async (): Promise<TraductorType[] | null> => {
  // Report request
  console.info("getTraductors called");

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
};
