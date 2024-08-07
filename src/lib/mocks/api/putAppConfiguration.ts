import sleep from '../sleep';

import { AppConfiguration, type AppConfigurationType, AppWebhooks, type AppWebhooksType } from '$types/schemas';
import { parse } from 'valibot';

interface PutAppConfigArgs {
  appConfiguration: AppConfigurationType;
  webhooks: AppWebhooksType;
}

export const putAppConfiguration = async ({ appConfiguration, webhooks }: PutAppConfigArgs): Promise<void> => {
  await sleep();

  try {
    const appConfigurationResult = parse(AppConfiguration, appConfiguration);
    console.log('🚀 ~ putAppConfiguration ~ appConfigurationResult:', appConfigurationResult);
    const appWebhooksResult = parse(AppWebhooks, webhooks);
    console.log('🚀 ~ putAppConfiguration ~ appWebhooksResult:', appWebhooksResult);
  } catch (error) {
    throw new Error(`Error in putAppConfiguration: ${error}`);
  }
};
