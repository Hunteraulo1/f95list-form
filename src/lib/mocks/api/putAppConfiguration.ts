import sleep from "../sleep";

import { PutAppConfigArgs } from "../../../server/api/putAppConfiguration";
import { AppConfiguration, AppConfigurationType } from "../../../types/schemas";

/**
 * @param {PutAppConfigArgs} args
 * @returns {Promise<AppConfigurationType | null>}
 */
export async function putAppConfiguration({
  appConfiguration,
}: PutAppConfigArgs): Promise<AppConfigurationType | null> {
  await sleep();

  const validAppConfig: AppConfigurationType =
    AppConfiguration.parse(appConfiguration);

  /** @type {AppConfiguration} */
  const mockResponse = validAppConfig;

  return JSON.parse(JSON.stringify(mockResponse));
}
