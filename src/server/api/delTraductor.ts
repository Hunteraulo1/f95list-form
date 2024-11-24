import type { TraductorType } from '$types/schemas';
import { disableLock, enableLock } from '../lib/lockMode';
import { checkUser } from '../lib/utils';

import { getTraductors } from './getTraductors';

export interface DelTraductorArgs {
  query: TraductorType['name'];
}

export const delTraductor = async ({ query }: DelTraductorArgs): Promise<void> => {
  console.info('delTraductor ~ args:', { query });

  checkUser('admin');

  enableLock();

  try {
    const traductors = (await getTraductors()) ?? [];

    const tradIndex = traductors.findIndex((traductor) => traductor.name === query);

    if (tradIndex === -1) {
      console.error('No detected getTraductor with index:', { traductorIndex: tradIndex });

      throw new Error('No detected getTraductor');
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet();

    const tradSheet = sheet.getSheetByName('Traducteurs/Relecteurs');

    if (!tradSheet) {
      console.error('No tradSheet detected');

      throw new Error('No tradSheet detected');
    }

    tradSheet.deleteRow(tradIndex + 2);
  } catch (error) {
    console.error(error);

    throw new Error('Un problème est survenue lors de la suppression du traducteur');
  } finally {
    disableLock();
  }
};
