import { loadAppConfiguration } from '../lib/loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export const getAppConfiguration = (): AppConfigurationType | null => {
  console.info('getAppConfiguration');

  isMaintenance();

  const appConfigurationObject = loadAppConfiguration();

  console.info(appConfigurationObject);

  return appConfigurationObject;
};
