import sleep from '$lib/sleep';
import { appConfiguration } from '../data/appConfiguration';

import { getAdmins } from './getAdmins';

import type { AppConfigurationType } from '$types/schemas';

export const getAppConfiguration = async (): Promise<AppConfigurationType> => {
  await sleep();

  const appConfig = {
    ...appConfiguration,
    admins: getAdmins(),
  };

  const mockResponse = appConfig;

  return JSON.parse(JSON.stringify(mockResponse));
};
