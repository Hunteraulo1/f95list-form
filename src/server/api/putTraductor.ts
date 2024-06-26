import { disableLock, enableLock } from '../lib/lockMode';

import { getTraductors } from './getTraductors';

import { Traductor, type TraductorType } from '$types/schemas';

interface PutTraductorArgs {
  query: { name: TraductorType['name'] };
  data: TraductorType;
}

export const putTraductor = async ({ query, data }: PutTraductorArgs): Promise<void | string> => {
  // Report request
  console.info('putTraductor called');

  enableLock();

  const validData = Traductor.parse(data);

  try {
    const traductors = await getTraductors();

    const traductorIndex = traductors.findIndex((traductor) => {
      traductor.name === query.name;
    });

    if (traductorIndex === -1) throw new Error('traductor not found');

    const duplicate = traductors?.findIndex((traductor) => traductor.name === validData.name);

    if (duplicate !== -1) {
      return 'duplicate';
    }

    const linksText: string[] = [];

    validData.links?.map((link) => {
      linksText.push(link.name);
    });

    const value = SpreadsheetApp.newRichTextValue();

    value.setText(linksText.join(' '));

    let step = 0;
    validData.links?.map((link) => {
      const start = step;
      const end = start + link.name.length;

      step = end + 1;

      value.setLinkUrl(start, end, link.name);
    });

    value.build();

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');
    const row = sheet?.getRange(`A${traductorIndex + 2}:B${traductorIndex + 2}`);

    row?.setValue([query.name, value]);
  } catch (error) {
    console.error(error);

    throw new Error('putTraductor error');
  } finally {
    disableLock();
  }
};
