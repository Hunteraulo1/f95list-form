import { AppConfiguration, type AppConfigurationType } from '$types/schemas';

export const loadAppConfiguration = (): AppConfigurationType | null => {
  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const appConfigurationString = scriptProperties.appConfiguration;

  if (!appConfigurationString) return null;

  const appConfig: AppConfigurationType = {
    ...JSON.parse(appConfigurationString),
  };

  AppConfiguration.parse(appConfig);

  return appConfig;
};
