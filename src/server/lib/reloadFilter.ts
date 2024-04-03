export const reloadFilter = (sheet: GoogleAppsScript.Spreadsheet.Sheet) => {
  const oldRange = sheet.getDataRange();
  const newRange = sheet.getRange(`A1:M${sheet.getLastRow()}`);
  oldRange.getFilter() && oldRange.getFilter()?.remove();
  newRange.createFilter();
  sheet.sort(3, true);
  SpreadsheetApp.flush();

  console.log("newFilter", "ok");
};
