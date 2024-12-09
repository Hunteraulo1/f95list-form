import { AppConfiguration } from '$types/schemas';

import type { AppConfigurationType } from '$types/schemas';

interface PutAppConfigArgs {
  appConfiguration: AppConfigurationType;
}

export const putAppConfiguration = async ({ appConfiguration }: PutAppConfigArgs): Promise<void> => {
  console.info('putAppConfiguration ~ args:', { appConfiguration });

  try {
    AppConfiguration.parse(appConfiguration);
  } catch (error) {
    throw new Error(`putAppConfiguration ~ Error: ${error}`);
  }
};
