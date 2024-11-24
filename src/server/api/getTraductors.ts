import type { TraductorType } from '$types/schemas';

export const getTraductors = async (): Promise<TraductorType[]> => {
  // Report request
  console.info('getTraductors called');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');

  if (!sheet) throw new Error('Sheet not found');

  const totalRow = sheet.getLastRow();

  const data = sheet.getRange(`A${2}:C${totalRow}`).getRichTextValues();

  const result = data.map((tr) => ({
    name: tr[0]?.getText() || '',
    links:
      tr[1]
        ?.getRuns()
        .filter((trl) => trl.getLinkUrl())
        .map((trl) => ({
          name: trl.getText(),
          link: trl.getLinkUrl() || '',
        })) ?? [],
    discordID: tr[2]?.getText() || '',
  }));

  console.info('getTraductors result:', result);

  return result;
};
