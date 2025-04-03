import { Traductor } from '$types/schemas';

import type { TraductorType } from '$types/schemas';

export const getTraductors = async (): Promise<TraductorType[]> => {
  console.info('getTraductors');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');

  if (!sheet) throw new Error('getTraductors ~ Sheet not found');

  const totalRow = sheet.getLastRow();

  const data = sheet.getRange(`A${2}:C${totalRow}`).getRichTextValues();

  const result = data.map((traductor) =>
    Traductor.parse({
      name: traductor[0]?.getText() || '',
      links:
        traductor[1]
          ?.getRuns()
          .filter((t) => t.getLinkUrl())
          .map((t) => ({
            name: t.getText(),
            link: t.getLinkUrl() || '',
          })) ?? [],
      discordID: traductor[2]?.getText() || '',
    }),
  );

  console.info('getTraductors ~ result:', result);

  return result;
};

export const getTraductorsCalc = async (): Promise<{ name: string; calc: number }[]> => {
  console.info('getTraductorsCalc');

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');

  if (!sheet) throw new Error('getTraductorsCalc ~ Sheet not found');

  const totalRow = sheet.getLastRow();

  const data = sheet.getRange(`A${2}:F${totalRow}`).getValues();

  const result = data.map((traductor) => ({
    name: traductor[0],
    calc: traductor[5],
  }));

  console.info('getTraductorsCalc ~ result:', result);

  return result;
};
