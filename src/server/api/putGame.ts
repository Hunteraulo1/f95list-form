import { Game, GameType } from "../../types/schemas";

/**
 * **API Endpoint** | Updates the app configuration and returns it
 * @param {GameType} args
 * @returns {string}
 */
export function putGame(game: GameType) {
  const invokingUserEmail = Session.getActiveUser().getEmail();

  console.log("putGame() called with: ", game, "by: ", invokingUserEmail);

  const validGame = Game.parse(game);

  // TODO: spreadsheet

  console.log("Game successfully added.", { validGame }); // TODO: delete validGame after dev
  return "success"; // TODO: renvoyer le status
}
