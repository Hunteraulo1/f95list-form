import { Traductor } from '$types/schemas';
import { disableLock, enableLock } from '../lib/lockMode';
import { checkUser } from '../lib/utils';
import { getTraductors } from './getTraductors';

import type { TraductorType } from '$types/schemas';
import { reloadFilter } from '../lib/reloadFilter';
export interface PutTraductorArgs {
  query: { name: TraductorType['name'] };
  data: TraductorType;
}

export const putTraductor = async ({ query, data }: PutTraductorArgs): Promise<void> => {
  console.info('putTraductor ~ args:', { query, data });

  await checkUser('admin');

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

    if (!sheet) throw new Error('sheet not found');

    const row = sheet.getRange(`A${traductorIndex + 2}`);
    const richRow = sheet.getRange(`B${traductorIndex + 2}`);
    const rowDiscordID = sheet.getRange(`C${traductorIndex + 2}`);

    row.setValue(validData.name);
    richRow.setRichTextValue(value.build());
    rowDiscordID.setValue(validData.discordID);

    reloadFilter({ sheet, end: 'F', sort: 6 });
  } catch (error) {
    console.error(error);

    throw new Error('putTraductor error');
  } finally {
    disableLock();
  }
};
