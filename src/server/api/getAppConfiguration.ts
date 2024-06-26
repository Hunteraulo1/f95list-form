import { loadAppConfiguration } from '../lib/loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const getAppConfiguration = (): AppConfigurationType | null => {
  console.info('getting app configuration');

  const appConfigurationObject = loadAppConfiguration();

  console.info(appConfigurationObject);

  // Do we want to filter the appConfig based on user?

  return appConfigurationObject;
};
