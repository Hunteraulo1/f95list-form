import { AppConfiguration, type AppConfigurationType } from "$types/schemas";

export type PutAppConfigArgs = {
  appConfiguration: AppConfigurationType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putAppConfiguration = ({
  appConfiguration,
}: PutAppConfigArgs): Promise<AppConfigurationType> => {
  console.info("putAppConfiguration() called with: ", appConfiguration);

  const validAppConfiguration = AppConfiguration.parse(appConfiguration);

  const propertyKey = "appConfiguration";
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty(
    propertyKey,
    JSON.stringify(appConfiguration)
  );

  return validAppConfiguration;
};
