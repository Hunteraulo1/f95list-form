import { loadAppConfiguration } from '../lib/loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const getAppConfiguration = (): AppConfigurationType | null => {
  console.groupCollapsed('getAppConfiguration');

  const appConfigurationObject = loadAppConfiguration();

  console.info(appConfigurationObject);

  console.groupEnd();

  // Do we want to filter the appConfig based on user?

  return appConfigurationObject;
};
