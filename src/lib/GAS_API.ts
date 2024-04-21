import type {
  AppConfigurationType,
  GameType,
  QueryGameType,
  ScrapeGameType,
  TraductorType,
  UserType,
} from "$types/schemas";
import { GetUserArgs } from "../server/api/getUser";
import { PutAppConfigArgs } from "../server/api/putAppConfiguration";
import { PutUserArgs } from "../server/api/putUser";
import { DelGameArgs } from "./mocks/api/delGame";
import { GetGameArgs } from "./mocks/api/getGame";
import { GetScrapeArgs } from "./mocks/api/getScrape";
import { PostGameArgs } from "./mocks/api/postGame";
import { PutGameArgs } from "./mocks/api/putGame";
import polyfillScriptRun from "./polyfillScriptRun";

polyfillScriptRun();

const callAPI = async <T, A = unknown>(
  functionName: string,
  args: A = [] as unknown as A
) => {
  console.info("calling api", functionName, args);

  return new Promise<T>((resolve, reject) => {
    google.script.run
      .withSuccessHandler((result: T) => resolve(result))
      .withFailureHandler((error: unknown) => {
        console.error("errrrrror !!!"); // TODO: test reject

        reject(error);
      })
      [functionName](...(Array.isArray(args) ? args : [args]));
  });
};

export const GAS_API = {
  // AppConfiguration
  getAppConfiguration: (): Promise<AppConfigurationType> =>
    callAPI<AppConfigurationType>("getAppConfiguration"),

  putAppConfiguration: (args: PutAppConfigArgs): Promise<void> =>
    callAPI<AppConfigurationType, typeof args>("putAppConfiguration", args),

  // User
  getUser: (args?: GetUserArgs) =>
    callAPI<UserType, typeof args>("getUser", args),

  putUser: (args: PutUserArgs) =>
    callAPI<UserType, typeof args>("putUser", args),

  // Game
  getGame: (args: GetGameArgs) =>
    callAPI<GameType, typeof args>("getGame", args),

  postGame: (args: PostGameArgs) =>
    callAPI<void | string, typeof args>("postGame", args),

  putGame: (args: PutGameArgs) =>
    callAPI<void | string, typeof args>("putGame", args),

  delGame: (args: DelGameArgs) => callAPI<void, typeof args>("delGame", args),

  getQueryGames: () => callAPI<QueryGameType[]>("getQueryGames"),

  // Traducteurs
  getTraductors: () => callAPI<TraductorType>("getTraductors"),

  // Others
  getScrape: (args: GetScrapeArgs) =>
    callAPI<ScrapeGameType, typeof args>("getScrape", args),

  sendWebhook: (args: boolean) =>
    callAPI<void, typeof args>("sendWebhook", args),
};
