import type { TraductorType } from "$types/schemas";

export const getTraductors = async (): Promise<TraductorType[]> => {
  // Report request
  console.info("getTraductors called");

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Traducteurs/Relecteurs"
  );

  if (!sheet) throw new Error("Sheet not found");

  const totalRow = sheet.getLastRow();

  let result;

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

  return result;
};
