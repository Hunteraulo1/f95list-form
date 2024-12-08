import { loadAppConfiguration } from '../lib/loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const getAppConfiguration = (): AppConfigurationType | null => {
  console.info('getAppConfiguration');

  const appConfigurationObject = loadAppConfiguration();

  console.info(appConfigurationObject);

  return appConfigurationObject;
};
