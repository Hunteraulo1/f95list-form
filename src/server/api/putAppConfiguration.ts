import { AppConfiguration, type AppConfigurationType, AppWebhooks, type AppWebhooksType } from '$types/schemas';
import { checkUser } from '../lib/utils';

export type PutAppConfigArgs = {
  appConfiguration: AppConfigurationType;
  webhooks: AppWebhooksType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putAppConfiguration = ({ appConfiguration, webhooks }: PutAppConfigArgs): void => {
  console.info('putAppConfiguration ~ args:', { appConfiguration, webhooks });

  try {
    checkUser('superAdmin');

    AppConfiguration.parse(appConfiguration);
    AppWebhooks.parse(webhooks);

    const scriptPropertiesService = PropertiesService.getScriptProperties();

    scriptPropertiesService.setProperty('appConfiguration', JSON.stringify(appConfiguration));
    if (webhooks.update !== '') scriptPropertiesService.setProperty('webhookUrl', JSON.stringify(webhooks.update));
    if (webhooks.logs !== '') scriptPropertiesService.setProperty('logsUrl', JSON.stringify(webhooks.logs));
    if (webhooks.traductor !== '')
      scriptPropertiesService.setProperty('traductorUrl', JSON.stringify(webhooks.traductor));
  } catch (error) {
    throw new Error(`putAppConfiguration ~ Error: ${error}`);
  }
};
