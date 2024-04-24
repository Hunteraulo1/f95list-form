import { getAdmins } from "./getAdmins";

import { AppConfiguration, type AppConfigurationType } from "$types/schemas";

export const loadAppConfiguration = () => {
  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const appConfigurationString = scriptProperties.appConfiguration || null;

  if (!appConfigurationString) return null;

  const appConfig: AppConfigurationType = {
    ...JSON.parse(appConfigurationString),
    admins: getAdmins(),
  };

  AppConfiguration.parse(appConfig);

  return appConfig;
};
