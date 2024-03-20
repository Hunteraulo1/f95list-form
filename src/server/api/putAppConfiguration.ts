import { AppConfiguration, AppConfigurationType } from "../../types/schemas";

export type PutAppConfigArgs = {
  appConfiguration: AppConfigurationType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 * @param {PutAppConfigArgs} args
 * @returns {AppConfigurationType | null}
 */
export function putAppConfiguration({
  appConfiguration,
}: PutAppConfigArgs): AppConfigurationType {
  console.log("putAppConfiguration() called with: ", appConfiguration);

  const validAppConfiguration = AppConfiguration.parse(appConfiguration);

  const propertyKey = "appConfiguration";
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty(
    propertyKey,
    JSON.stringify(appConfiguration)
  );

  return validAppConfiguration;
}
