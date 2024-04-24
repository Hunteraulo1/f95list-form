import type { QueryGameType } from "$types/schemas"

export const getQueryGames = async (): Promise<QueryGameType[]> => {
  // Report request
  console.info("getQueryGames called")

  const sheet = SpreadsheetApp.getActiveSpreadsheet()
  const gameSheet = sheet.getSheetByName("Jeux")

  const totalRow = gameSheet?.getLastRow()
  const data = gameSheet?.getRange(`C2:D${totalRow}`).getValues()

  if (!data) throw new Error("getQueryGames no return")

  const queryGames = data.map(([id, , name, version]) => {
    return { id, name, version }
  })

  return queryGames
}
