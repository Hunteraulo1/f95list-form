import { disableLock, enableLock } from '../lib/lockMode';

import { getTraductors } from './getTraductors';

import { Traductor, type TraductorType } from '$types/schemas';

export interface PutTraductorArgs {
  query: { name: TraductorType['name'] };
  data: TraductorType;
}

export const putTraductor = async ({ query, data }: PutTraductorArgs): Promise<void> => {
  // Report request
  console.info('putTraductor called with args:', { query, data });

  enableLock();

  const validData = Traductor.parse(data);

  try {
    const traductors = await getTraductors();

    const traductorIndex = traductors.findIndex((traductor) => traductor.name === query.name);

    if (traductorIndex === -1) throw new Error('traductor not found');

    const value = SpreadsheetApp.newRichTextValue();

    const linksText: string[] = validData.links?.map((link) => link.name);
    value.setText(linksText.join(' - '));

    const resetStyle = SpreadsheetApp.newTextStyle().setUnderline(false).build();
    value.setTextStyle(resetStyle);

    const linkStyle = SpreadsheetApp.newTextStyle().setBold(true).setUnderline(true).setFontFamily('Calibri').build();

    let step = 0;
    validData.links?.map((link) => {
      const start = step;
      const end = start + link.name.length;

      step = end + 3;

      value.setTextStyle(start, end, linkStyle);
      value.setLinkUrl(start, end, link.link);
    });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Traducteurs/Relecteurs');
    const row = sheet?.getRange(`A${traductorIndex + 2}`);
    const richRow = sheet?.getRange(`B${traductorIndex + 2}`);
    const rowDiscordID = sheet?.getRange(`C${traductorIndex + 2}`);

    row?.setValue(validData.name);
    richRow?.setRichTextValue(value.build());
    rowDiscordID?.setValue(validData.discordID);
  } catch (error) {
    console.error(error);

    throw new Error('putTraductor error');
  } finally {
    disableLock();
  }
};
