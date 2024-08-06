import { disableLock, enableLock } from '../lib/lockMode';

import { getTraductors } from './getTraductors';

import { Traductor, type TraductorType } from '$types/schemas';

export interface PutTraductorArgs {
  query: { name: TraductorType['name'] };
  data: TraductorType;
}

export const putTraductor = async ({ query, data }: PutTraductorArgs): Promise<void | string> => {
  // Report request
  console.info('putTraductor called with args:', { query, data });

  enableLock();

  const validData = Traductor.parse(data);
  console.log('🚀 ~ putTraductor ~ validData:', validData);

  try {
    const traductors = await getTraductors();

    const traductorIndex = traductors.findIndex((traductor) => traductor.name === query.name);
    console.log('🚀 ~ traductorIndex ~ traductorIndex:', traductorIndex);

    if (traductorIndex === -1) throw new Error('traductor not found');

    const linksText: string[] = [];

    validData.links?.map((link) => {
      linksText.push(link.name);
    });
    console.log('🚀 ~ putTraductor ~ linksText:', linksText);

    const value = SpreadsheetApp.newRichTextValue();

    value.setText(linksText.join(' - '));

    let step = 0;
    validData.links?.map((link) => {
      const start = step;
      const end = start + link.name.length;

      step = end + 3;

      value.setLinkUrl(start, end, link.link);
      console.log('🚀 ~ validData.links?.map ~ link:', { link });
    });

    value.build();

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');
    // const row = sheet?.getRange(`A${traductorIndex + 2}:B${traductorIndex + 2}`);
    const row = sheet?.getRange(`B${traductorIndex + 2}:B${traductorIndex + 2}`);

    console.log('🚀 ~ putTraductor ~ row:', row?.getValues());
    row?.setRichTextValues([[value.build()]]);
  } catch (error) {
    console.error(error);

    throw new Error('putTraductor error');
  } finally {
    disableLock();
  }
};
