import { appConfiguration } from '../data/appConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const getAppConfiguration = async (): Promise<AppConfigurationType> => {
  console.info('getAppConfiguration');

  return JSON.parse(JSON.stringify(appConfiguration));
};
