import { getAdmins } from '../api/getAdmins';

import { AppConfiguration, type AppConfigurationType } from '$types/schemas';
import { parse } from 'valibot';

export const loadAppConfiguration = () => {
  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const appConfigurationString = scriptProperties.appConfiguration || null;

  if (!appConfigurationString) return null;

  const appConfig: AppConfigurationType = {
    ...JSON.parse(appConfigurationString),
    admins: getAdmins(),
  };

  parse(AppConfiguration, appConfig);

  return appConfig;
};
