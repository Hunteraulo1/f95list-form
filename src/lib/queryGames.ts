import { GAS_API } from "./GAS_API";
import { queryGames } from "./stores";

/**
 * Fetches the queryGames from the server.
 */
export const fetchQueryGames = async () => {
  console.info("fetching QueryGames...");

  try {
    const result = await GAS_API.getQueryGames();

    if (typeof result === "string") throw new Error("getQueryGames no result");

    console.info("QueryGames:", result);
    queryGames.set(result);
  } catch (error) {
    console.error("Could not get QueryGames:", error);
  } finally {
    console.info("QueryGames loaded.");
  }
};
