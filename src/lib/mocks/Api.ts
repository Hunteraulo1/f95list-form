import { delGame } from './api/delGame';
import { getAppConfiguration } from './api/getAppConfiguration';
import { getGame } from './api/getGame';
import { getQueryGames } from './api/getQueryGames';
import { getScrape } from './api/getScrape';
import { getTraductors } from './api/getTraductors';
import { getUser } from './api/getUser';
import { getUsers } from './api/getUsers';
import { postGame } from './api/postGame';
import { postTraductor } from './api/postTraductor';
import { putAppConfiguration } from './api/putAppConfiguration';
import { putGame } from './api/putGame';
import { putTraductor } from './api/putTraductor';
import { putUser, putUserRole } from './api/putUser';

type MockEndpoints = {
  // App Configuration
  getAppConfiguration: typeof getAppConfiguration;
  putAppConfiguration: typeof putAppConfiguration;

  // User
  getUser: typeof getUser;
  getUsers: typeof getUsers;
  putUser: typeof putUser;
  putUserRole: typeof putUserRole;

  // Game
  getGame: typeof getGame;
  postGame: typeof postGame;
  putGame: typeof putGame;
  delGame: typeof delGame;
  getQueryGames: typeof getQueryGames;
  getScrape: typeof getScrape;

  // Traductor
  getTraductors: typeof getTraductors;
  postTraductor: typeof postTraductor;
  putTraductor: typeof putTraductor;
};

const getMockEndpoints = (): MockEndpoints => {
  return {
    // App Configuration
    getAppConfiguration,
    putAppConfiguration,

    // User
    getUser,
    getUsers,
    putUser,
    putUserRole,

    // Game
    getGame,
    postGame,
    putGame,
    delGame,
    getQueryGames,
    getScrape,

    // Traductor
    getTraductors,
    postTraductor,
    putTraductor,
  };
};

export default getMockEndpoints;
