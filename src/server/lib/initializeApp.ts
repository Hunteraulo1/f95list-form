import { postUser } from '../api/postUser';
import { loadAppConfiguration } from './loadAppConfiguration';

import type { AppConfigurationType } from '$types/schemas';

export const initializeApp = (): AppConfigurationType => {
  console.info('initializeApp');

  const deployingUserEmail = Session.getEffectiveUser().getEmail();

  if (!deployingUserEmail) throw new Error('No deploying user email found');

  postUser(deployingUserEmail, { role: 'superAdmin' });

  const newAppConfig: AppConfigurationType = {
    appName: 'Gestionnaire des traductions',
    deployingUserEmail,
    webhooks: {
      update: '',
      logs: '',
      traductor: '',
      lister: '',
    },
  };

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  scriptPropertiesService.setProperty('appConfiguration', JSON.stringify(newAppConfig));

  const appConfig = loadAppConfiguration();

  return JSON.parse(JSON.stringify(appConfig)) as AppConfigurationType;
};
