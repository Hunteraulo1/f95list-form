import { delGame } from './api/delGame';
import { delSubmit } from './api/delSubmit';
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
import { putSubmit, putSubmitStatus } from './api/putSubmit';
import { putTraductor } from './api/putTraductor';
import { delActivity, putUser, putUserRole } from './api/putUser';

import type { GAS_API } from '$lib/GAS_API';

export type MockEndpoints = {
  [K in keyof typeof GAS_API]: (typeof GAS_API)[K];
};

const doLogout = async (): Promise<void> => {};

const getMockEndpoints = (): MockEndpoints => ({
  // App Configuration
  getAppConfiguration,
  putAppConfiguration,

  // User
  getUser,
  getUsers,
  putUser,
  putUserRole,
  delActivity,

  // Game
  getGame,
  postGame,
  putGame,
  delGame,
  getQueryGames,

  // Other
  getScrape,
  doLogout,

  // Traductor
  getTraductors,
  postTraductor,
  putTraductor,
  delTraductor,

  // Submit
  getSubmits,
  postSubmit,
  putSubmit,
  putSubmitStatus,
  delSubmit,
});

export default getMockEndpoints;
