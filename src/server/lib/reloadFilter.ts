export const reloadFilter = async (sheet: GoogleAppsScript.Spreadsheet.Sheet) => {
  const oldRange = await sheet.getDataRange();
  const newRange = await sheet.getRange(`A1:N${sheet.getLastRow()}`);

  await oldRange?.getFilter()?.remove();
  await newRange.createFilter();
  await SpreadsheetApp.flush();
  await sheet.sort(3, true);
  await SpreadsheetApp.flush();

  console.info('newFilter', 'ok');
};
