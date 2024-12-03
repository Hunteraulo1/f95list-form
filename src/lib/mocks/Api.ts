import { delGame } from './api/delGame';
import { delTraductor } from './api/delTraductor';
import { getAppConfiguration } from './api/getAppConfiguration';
import { getGame } from './api/getGame';
import { getQueryGames } from './api/getQueryGames';
import { getScrape } from './api/getScrape';
import { getSubmits } from './api/getSubmits';
import { getTraductors } from './api/getTraductors';
import { getUser } from './api/getUser';
import { getUsers } from './api/getUsers';
import { postGame } from './api/postGame';
import { postSubmit } from './api/postSubmit';
import { postTraductor } from './api/postTraductor';
import { putAppConfiguration } from './api/putAppConfiguration';
import { putGame } from './api/putGame';
import { putSubmit } from './api/putSubmit';
import { putTraductor } from './api/putTraductor';
import { putUser, putUserRole } from './api/putUser';

import type { GAS_API } from '$lib/GAS_API';

export type MockEndpoints = {
  [K in keyof typeof GAS_API]: (typeof GAS_API)[K];
};

const getMockEndpoints = (): MockEndpoints => ({
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
  delTraductor,

  // Submit
  getSubmits,
  postSubmit,
  putSubmit,
});

export default getMockEndpoints;
