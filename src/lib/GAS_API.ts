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
import type { PutSubmitArgs, PutSubmitStatusArgs } from '../server/api/putSubmit';
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

import { DelSubmitArgs } from '../server/api/delSubmit';
import './polyfillScriptRun.js';

const callAPI = async <T, A = unknown>(functionName: string, args: A = [] as unknown as A): Promise<T> => {
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
  putAppConfiguration: (args: PutAppConfigArgs): Promise<void> =>
    callAPI<void, typeof args>('putAppConfiguration', args),

  // User
  getUser: (args?: GetUserArgs): Promise<UserType> => callAPI<UserType, typeof args>('getUser', args),
  getUsers: (): Promise<UserType[]> => callAPI<UserType[]>('getUsers'),
  putUser: (args: PutUserArgs): Promise<void> => callAPI<void, typeof args>('putUser', args),
  putUserRole: (args: PutUserArgs): Promise<void> => callAPI<void, typeof args>('putUserRole', args),

  // Game
  getGame: (args: GetGameArgs): Promise<GameType> => callAPI<GameType, typeof args>('getGame', args),
  postGame: (args: PostGameArgs): Promise<undefined | string> =>
    callAPI<undefined | string, typeof args>('postGame', args),
  putGame: (args: PutGameArgs): Promise<undefined | string> =>
    callAPI<undefined | string, typeof args>('putGame', args),
  delGame: (args: DelGameArgs): Promise<void> => callAPI<void, typeof args>('delGame', args),
  getQueryGames: (): Promise<QueryGameType[]> => callAPI<QueryGameType[]>('getQueryGames'),

  // Traducteurs
  getTraductors: (): Promise<TraductorType[]> => callAPI<TraductorType[]>('getTraductors'),
  postTraductor: (args: PostTraductorArgs): Promise<undefined | string> =>
    callAPI<undefined | string, typeof args>('postTraductor', args),
  putTraductor: (args: PutTraductorArgs): Promise<undefined | string> =>
    callAPI<undefined | string, typeof args>('putTraductor', args),
  delTraductor: (args: DelTraductorArgs): Promise<void> => callAPI<void, typeof args>('delTraductor', args),

  // Others
  getScrape: (args: GetScrapeArgs): Promise<ScrapeGameType> => callAPI<ScrapeGameType, typeof args>('getScrape', args),

  // Submit
  getSubmits: (args: GetSubmitsArgs): Promise<SubmitType[]> => callAPI<SubmitType[], typeof args>('getSubmits', args),
  postSubmit: (args: PostSubmitType): Promise<undefined | string> =>
    callAPI<undefined | string, typeof args>('postSubmit', args),
  putSubmit: (args: PutSubmitArgs): Promise<void> => callAPI<void, typeof args>('putSubmit', args),
  putSubmitStatus: (args: PutSubmitStatusArgs): Promise<void> => callAPI<void, typeof args>('putSubmitStatus', args),
  delSubmit: (args: DelSubmitArgs): Promise<void> => callAPI<void, typeof args>('delSubmit', args),
};
