import polyfillScriptRun from "./polyfillScriptRun";
polyfillScriptRun();

/**
 * Generic function to handle API calls
 * @param {string} functionName
 * @param {any} [args=[]] - Optional arguments
 * @returns {Promise<any>}
 */
const callAPI = async (functionName: string, args = []) => {
  console.log("calling api", functionName, args);
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      // eslint-disable-next-line no-unexpected-multiline
      [functionName](...(Array.isArray(args) ? args : [args]));
  });
};

export const GAS_API = {
  /**
   * @returns {Promise<AppConfiguration>} the app configuration
   */
  getAppConfiguration: () => callAPI("getAppConfiguration"),

  /**
   * @param {PutAppConfigArgs} args
   * @returns {Promise<AppConfiguration>} the app configuration
   */
  putAppConfiguration: (args: any) => callAPI("putAppConfiguration", args),

  /**
   * @param {GetUserArgs} [args] - Optional parameter containing user email
   * @returns {Promise<User>}
   */
  getUser: (args: any) => callAPI("getUser", args),

  /**
   *
   * @param {PutUserArgs} args
   * @returns {Promise<User>}
   */
  putUser: (args: any) => callAPI("putUser", args),

  /**
   * @param {GetGameArgs} [args] - Optional parameter containing game name and version
   * @returns {Promise<Game>}
   */
  getGame: (args: any) => callAPI("getGame", args),

  /**
   * @param {GetScrapeArgs} [args] - Optional parameter containing game domain and id
   * @returns {Promise<ScrapeGameType>}
   */
  getScrape: (args: any) => callAPI("getScrape", args),

  /**
   * @param {PostGameArgs} [args] - Optional parameter containing game
   * @returns {Promise<string>}
   */
  postGame: (args: any) => callAPI("postGame", args),

  /**
   * @param {PutGameArgs} [args] - Optional parameter containing game
   * @returns {Promise<string>}
   */
  putGame: (args: any) => callAPI("putGame", args),

  /**
   * @param {DelGameArgs} [args] - Optional parameter containing game
   * @returns {Promise<string>}
   */
  delGame: (args: any) => callAPI("delGame", args),

  /**
   * @returns {Promise<QueryGamesType>}
   */
  getQueryGames: () => callAPI("getQueryGames"),

  /**
   * @returns {Promise<TraductorsArgsType>}
   */
  getTraductors: () => callAPI("getTraductors"),

  /**
   * @returns {Promise<WebhookArgsType>}
   */
  sendWebhook: () => callAPI("sendWebhook"),
};
