import { postUser } from '../api/postUser';
import { loadAppConfiguration } from './loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const initializeApp = (): AppConfigurationType => {
  console.groupCollapsed('initializeApp');

  const deployingUserEmail = Session.getEffectiveUser().getEmail();

  if (!deployingUserEmail) throw new Error('No deploying user email found');

  postUser(deployingUserEmail, { role: 'superAdmin' });

  const newAppConfig: AppConfigurationType = {
    appName: 'My App',
    deployingUserEmail,
  };

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  scriptPropertiesService.setProperty('appConfiguration', JSON.stringify(newAppConfig));

  const appConfig = loadAppConfiguration();

  console.groupEnd();

  return JSON.parse(JSON.stringify(appConfig)) as AppConfigurationType;
};
