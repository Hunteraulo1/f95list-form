import { Traductor } from '$types/schemas';

import type { TraductorType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export const getTraductors = async (): Promise<TraductorType[]> => {
  console.info('getTraductors');

  isMaintenance();

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
