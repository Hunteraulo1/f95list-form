import { delGame } from "./api/delGame";
import { getAppConfiguration } from "./api/getAppConfiguration";
import { getGame } from "./api/getGame";
import { getQueryGames } from "./api/getQueryGames";
import { getScrape } from "./api/getScrape";
import { getTest } from "./api/getTest";
import { getTraductors } from "./api/getTraductors";
import { getUser } from "./api/getUser";
//import { getViewConfiguration } from "./api/getViewConfiguration";
import { postGame } from "./api/postGame";
import { putAppConfiguration } from "./api/putAppConfiguration";
import { putGame } from "./api/putGame";
import { putUser } from "./api/putUser";

type MockEndpoints = {
  // App Configuration
  getAppConfiguration: typeof getAppConfiguration;
  putAppConfiguration: typeof putAppConfiguration;

  // User
  getUser: typeof getUser;
  putUser: typeof putUser;

  // Test
  getTest: typeof getTest;

  // Game
  getGame: typeof getGame;
  postGame: typeof postGame;
  putGame: typeof putGame;
  delGame: typeof delGame;
  getQueryGames: typeof getQueryGames;
  getTraductors: typeof getTraductors;
  getScrape: typeof getScrape;

  // Views
  // getViewConfiguration: typeof getViewConfiguration;
  // getViewData: typeof getViewData;
};

export default function getMockEndpoints(): MockEndpoints {
  return {
    // App Configuration
    getAppConfiguration,
    putAppConfiguration,

    // User
    getUser,
    putUser,

    // Test
    getTest,

    // Game
    getGame,
    postGame,
    putGame,
    delGame,
    getQueryGames,
    getTraductors,
    getScrape,

    // Views
    // getViewConfiguration,
    // getViewData,
  };
}
