import { AppConfiguration, AppWebhooks } from '$types/schemas';

import type { AppConfigurationType, AppWebhooksType } from '$types/schemas';

interface PutAppConfigArgs {
  appConfiguration: AppConfigurationType;
  webhooks: AppWebhooksType;
}

export const putAppConfiguration = async ({ appConfiguration, webhooks }: PutAppConfigArgs): Promise<void> => {
  console.info('putAppConfiguration ~ args:', { appConfiguration, webhooks });

  try {
    AppConfiguration.parse(appConfiguration);
    AppWebhooks.parse(webhooks);
  } catch (error) {
    throw new Error(`putAppConfiguration ~ Error: ${error}`);
  }
};
