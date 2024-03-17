import { queryGames } from "../stores";
import { GAS_API } from "./GAS_API";

/**
 * Fetches the queryGames from the server.
 */
export const fetchQueryGames = async () => {
  console.log("fetching QueryGames...");

  GAS_API.getQueryGames()
    .then((result) => {
      queryGames.set(result);
      console.log("QueryGames:", result);
    })
    .catch((err) => {
      console.error("Could not get QueryGames:", err);
    })
    .finally(() => {
      console.log("QueryGames loaded.");
    });
};
