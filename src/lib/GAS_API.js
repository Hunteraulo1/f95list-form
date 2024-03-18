import polyfillScriptRun from "./polyfillScriptRun";
polyfillScriptRun();

/**
 * Generic function to handle API calls
 * @param {string} functionName
 * @param {any} [args=[]] - Optional arguments
 * @returns {Promise<any>}
 */
const callAPI = async (functionName, args = []) => {
  console.log("calling api", functionName, args);
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
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
  putAppConfiguration: (args) => callAPI("putAppConfiguration", args),

  /**
   * @param {GetUserArgs} [args] - Optional parameter containing user email
   * @returns {Promise<User>}
   */
  getUser: (args) => callAPI("getUser", args),

  /**
   *
   * @param {PutUserArgs} args
   * @returns {Promise<User>}
   */
  putUser: (args) => callAPI("putUser", args),

  /**
   * @param {GetViewConfigArgs} args
   * @returns {Promise<ViewConfiguration>}
   */
  getViewConfiguration: (args) => callAPI("getViewConfiguration", args),

  /**
   * @param {GetViewDataArgs} args
   * @returns {Promise<View>}
   */
  getViewData: (args) => callAPI("getViewData", args),

  /**
   * @param {GetGameArgs} [args] - Optional parameter containing game name and version
   * @returns {Promise<Game>}
   */
  getGame: (args) => callAPI("getGame", args),

  /**
   * @param {GetScrapeArgs} [args] - Optional parameter containing game domain and id
   * @returns {Promise<ScrapeGameType>}
   */
  getScrape: (args) => callAPI("getScrape", args),

  /**
   * @param {PostGameArgs} [args] - Optional parameter containing game
   * @returns {Promise<string>}
   */
  postGame: (args) => callAPI("postGame", args),

  /**
   * @param {PutGameArgs} [args] - Optional parameter containing game
   * @returns {Promise<string>}
   */
  putGame: (args) => callAPI("putGame", args),

  /**
   * @returns {Promise<QueryGames>}
   */
  getQueryGames: () => callAPI("getQueryGames"),

  /**
   * @returns {Promise<string>}
   */
  getTest: () => callAPI("getTest"),
};
