import type { DelGameArgs } from '../server/api/delGame';
import type { DelTraductorArgs } from '../server/api/delTraductor';
import type { GetGameArgs } from '../server/api/getGame';
import type { GetScrapeArgs } from '../server/api/getScrape';
import type { GetSubmitsArgs } from '../server/api/getSubmits';
import type { GetUserArgs } from '../server/api/getUser';
import type { PostGameArgs } from '../server/api/postGame';
import type { PostTraductorArgs } from '../server/api/postTraductor';
import type { PutAppConfigArgs } from '../server/api/putAppConfiguration';
import type { PutGameArgs } from '../server/api/putGame';
import type { PutSubmitArgs } from '../server/api/putSubmit';
import type { PutTraductorArgs } from '../server/api/putTraductor';
import type { PutUserArgs } from '../server/api/putUser';

import type {
  AppConfigurationType,
  GameType,
  PostSubmitType,
  QueryGameType,
  ScrapeGameType,
  SubmitType,
  TraductorType,
  UserType,
} from '$types/schemas';

import './polyfillScriptRun.js';

const callAPI = async <T, A = unknown>(functionName: string, args: A = [] as unknown as A) => {
  console.info('calling api', functionName, args);

  return new Promise<T>((resolve, reject) => {
    google.script.run
      .withSuccessHandler((result: T) => resolve(result))
      .withFailureHandler((error: unknown) => reject(error))
      [functionName](...(Array.isArray(args) ? args : [args]));
  });
};

export const GAS_API = {
  // AppConfiguration
  getAppConfiguration: (): Promise<AppConfigurationType> => callAPI<AppConfigurationType>('getAppConfiguration'),
  putAppConfiguration: (args: PutAppConfigArgs) => callAPI<void, typeof args>('putAppConfiguration', args),

  // User
  getUser: (args?: GetUserArgs) => callAPI<UserType, typeof args>('getUser', args),
  getUsers: () => callAPI<UserType[]>('getUsers'),
  putUser: (args: PutUserArgs) => callAPI<void, typeof args>('putUser', args),
  putUserRole: (args: PutUserArgs) => callAPI<void, typeof args>('putUserRole', args),

  // Game
  getGame: (args: GetGameArgs) => callAPI<GameType, typeof args>('getGame', args),
  postGame: (args: PostGameArgs) => callAPI<undefined | string, typeof args>('postGame', args),
  putGame: (args: PutGameArgs) => callAPI<undefined | string, typeof args>('putGame', args),
  delGame: (args: DelGameArgs) => callAPI<void, typeof args>('delGame', args),
  getQueryGames: () => callAPI<QueryGameType[]>('getQueryGames'),

  // Traducteurs
  getTraductors: () => callAPI<TraductorType[]>('getTraductors'),
  postTraductor: (args: PostTraductorArgs) => callAPI<undefined | string, typeof args>('postTraductor', args),
  putTraductor: (args: PutTraductorArgs) => callAPI<undefined | string, typeof args>('putTraductor', args),
  delTraductor: (args: DelTraductorArgs) => callAPI<void, typeof args>('delTraductor', args),

  // Others
  getScrape: (args: GetScrapeArgs) => callAPI<ScrapeGameType, typeof args>('getScrape', args),

  // Submit
  getSubmits: (args: GetSubmitsArgs) => callAPI<SubmitType[], typeof args>('getSubmits', args),
  postSubmit: (args: PostSubmitType) => callAPI<void, typeof args>('postSubmit', args),
  putSubmit: (args: PutSubmitArgs) => callAPI<void, typeof args>('putSubmit', args),
};
