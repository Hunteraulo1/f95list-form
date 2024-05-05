import { AppConfiguration, AppWebhooks, type AppConfigurationType, type AppWebhooksType } from "$types/schemas";

export type PutAppConfigArgs = {
  appConfiguration: AppConfigurationType;
  webhooks: AppWebhooksType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putAppConfiguration = ({ appConfiguration, webhooks }: PutAppConfigArgs): void => {
  try {
    console.info("🚀 ~ putAppConfiguration ~ webhooks:", webhooks);

    console.info("putAppConfiguration() called with: ", appConfiguration);

    AppConfiguration.parse(appConfiguration);
    AppWebhooks.parse(webhooks);

    const scriptPropertiesService = PropertiesService.getScriptProperties();

    scriptPropertiesService.setProperty("appConfiguration", JSON.stringify(appConfiguration));
    if (webhooks.update !== "") scriptPropertiesService.setProperty("webhookUrl", JSON.stringify(webhooks.update));
    if (webhooks.logs !== "") scriptPropertiesService.setProperty("logsUrl", JSON.stringify(webhooks.logs));
  } catch (error) {
    throw new Error(`Error in putAppConfiguration: ${error}`);
  }
};
