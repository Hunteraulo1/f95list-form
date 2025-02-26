interface ReloadedFilterArgs {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  end: string;
  sort: number;
  asc?: boolean;
}

export const reloadFilter = async ({ sheet, end, sort, asc = true }: ReloadedFilterArgs): Promise<void> => {
  console.info('reloadFilter');

  const oldRange = await sheet.getDataRange();
  const newRange = await sheet.getRange(`A1:${end}${sheet.getLastRow()}`);

  await oldRange?.getFilter()?.remove();
  await newRange.createFilter();
  await SpreadsheetApp.flush();
  await sheet.sort(sort, asc);
  await SpreadsheetApp.flush();

  console.info('filter reloaded');
};
