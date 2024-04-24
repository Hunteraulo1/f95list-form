import { GameType } from "../../../types/schemas"
import { games } from "../data/game"
import sleep from "../sleep"

export const getGames = async (): Promise<GameType[] | null> => {
  await sleep()

  return JSON.parse(JSON.stringify(games))
}
