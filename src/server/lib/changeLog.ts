import type { GameType } from '$types/schemas';

interface ChangeLogArgs {
  game: GameType['name'];
  status: 'MISE À JOUR' | 'AJOUT DE JEU';
}

export const changelog = ({ game, status }: ChangeLogArgs): void => {
  console.info('changelog ~ args:', { game, status });

  const sheet = SpreadsheetApp.getActiveSpreadsheet();
  const releaseSheet = sheet.getSheetByName('MAJ');
  const rows = releaseSheet?.getRange('A2:C3');
  const rowsValues = rows?.getValues();
  const now = new Date().toLocaleDateString('fr-FR');

  if (!rowsValues || !releaseSheet) return;

  for (let i = 0; i < rowsValues.length; i++) {
    const cellDate = new Date(rowsValues[i][0]).toLocaleDateString('fr-FR');

    if (cellDate === now && status === rowsValues[i][1]) {
      updateExistingRow({
        sheet: releaseSheet,
        rowIndex: i,
        newGame: game,
        existingGames: rowsValues[i][2],
      });
      return;
    }
  }

  insertNewRow({ sheet: releaseSheet, date: now, status, game });
};

interface UpdateExistingRowArgs {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  rowIndex: number;
  newGame: GameType['name'];
  existingGames: GameType['name'];
}

const updateExistingRow = ({ sheet, rowIndex, newGame, existingGames }: UpdateExistingRowArgs): void => {
  console.info('updateExistingRow ~ args:', { sheet, rowIndex, newGame, existingGames });

  const games = existingGames.split(',  ');

  if (games.includes(newGame)) return;

  const updatedGames = `${existingGames},  ${newGame}`;
  sheet.getRange(`C${rowIndex + 2}`).setValue(updatedGames);
};

interface InsertNewRowArgs {
  sheet: GoogleAppsScript.Spreadsheet.Sheet;
  date: string;
  status: ChangeLogArgs['status'];
  game: GameType['name'];
}

const insertNewRow = ({ sheet, date, status, game }: InsertNewRowArgs): void => {
  console.info('insertNewRow ~ args:', { sheet, date, status, game });

  sheet.insertRowBefore(2);
  sheet.getRange('A2:C2').setValues([[date, status, game]]);
};
