import { postUser } from '../api/postUser';

import { loadAppConfiguration } from './loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const initializeApp = (): AppConfigurationType => {
  const deployingUserEmail = Session.getEffectiveUser().getEmail();

  if (!deployingUserEmail) throw new Error('No deploying user email found');

  postUser(deployingUserEmail, { roles: ['superAdmin'] });

  const newAppConfig: AppConfigurationType = {
    appName: 'My App',
    deployingUserEmail,
    admins: [],
  };

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  scriptPropertiesService.setProperty('appConfiguration', JSON.stringify(newAppConfig));

  const appConfig = loadAppConfiguration();

  return JSON.parse(JSON.stringify(appConfig)) as AppConfigurationType;
};
