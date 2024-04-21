export const reloadFilter = async (
  sheet: GoogleAppsScript.Spreadsheet.Sheet
) => {
  const oldRange = sheet.getDataRange();
  const newRange = sheet.getRange(`A1:M${sheet.getLastRow()}`);

  await oldRange?.getFilter()?.remove();
  await newRange.createFilter();
  await sheet.sort(3, true);
  SpreadsheetApp.flush();

  console.info("newFilter", "ok");
};
