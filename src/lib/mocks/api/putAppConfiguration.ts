import sleep from '$lib/sleep';

import { AppConfiguration, type AppConfigurationType, AppWebhooks, type AppWebhooksType } from '$types/schemas';

interface PutAppConfigArgs {
  appConfiguration: AppConfigurationType;
  webhooks: AppWebhooksType;
}

export const putAppConfiguration = async ({ appConfiguration, webhooks }: PutAppConfigArgs): Promise<void> => {
  await sleep();

  try {
    const appConfigurationResult = AppConfiguration.parse(appConfiguration);
    console.log('🚀 ~ putAppConfiguration ~ appConfigurationResult:', appConfigurationResult);
    const appWebhooksResult = AppWebhooks.parse(webhooks);
    console.log('🚀 ~ putAppConfiguration ~ appWebhooksResult:', appWebhooksResult);
  } catch (error) {
    throw new Error(`Error in putAppConfiguration: ${error}`);
  }
};
