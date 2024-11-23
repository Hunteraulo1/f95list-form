import { Traductor, type TraductorType } from '$types/schemas';
import { disableLock, enableLock } from '../lib/lockMode';
import { checkUser } from '../lib/utils';
import { getTraductors } from './getTraductors';
export interface PostTraductorArgs {
  traductor: TraductorType;
}

export const postTraductor = async ({ traductor }: PostTraductorArgs): Promise<undefined | string> => {
  // Report request
  console.info('postTraductor called with args:', { dataTraductor: traductor });

  checkUser('admin');

  try {
    enableLock();

    const validTraductor = Traductor.parse(traductor);
    const traductors = await getTraductors();

    const duplicate = traductors?.findIndex(
      (traductor) => traductor.name.toLowerCase() === validTraductor.name.toLowerCase(),
    );

    if (duplicate !== -1) {
      return 'duplicate';
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');

    if (!sheet) throw new Error('No gameSheet found');

    const totalRow = sheet.getLastRow();

    const convertedTraductor: string[] = [
      validTraductor.name ?? '',
      '',
      `=COUNTIF(Jeux!J$3:J;"*"&A${totalRow + 1}&"*")`,
      `=COUNTIF(Jeux!K$3:K;"*"&A${totalRow + 1}&"*")`,
      `=C${totalRow + 1}+D${totalRow + 1}`,
    ];

    sheet.insertRowAfter(totalRow);

    const row = sheet.getRange(`A${totalRow + 1}:E${totalRow + 1}`);

    row.setValues([convertedTraductor]);
  } catch (error) {
    console.error(error);

    throw new Error("Un problème est survenue lors de l'ajout du traducteur");
  } finally {
    disableLock();
  }
};
