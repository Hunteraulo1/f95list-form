import { AppConfiguration } from '$types/schemas';
import { checkUser } from '../lib/utils';

import type { AppConfigurationType } from '$types/schemas';

export type PutAppConfigArgs = {
  appConfiguration: AppConfigurationType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putAppConfiguration = async ({ appConfiguration }: PutAppConfigArgs): Promise<void> => {
  console.info('putAppConfiguration ~ args:', { appConfiguration });

  try {
    await checkUser('superAdmin');

    const validAppConfiguration = AppConfiguration.parse(appConfiguration);

    const scriptPropertiesService = PropertiesService.getScriptProperties();

    scriptPropertiesService.setProperty('appConfiguration', JSON.stringify(validAppConfiguration));
  } catch (error) {
    throw new Error(`putAppConfiguration ~ Error: ${error}`);
  }
};
