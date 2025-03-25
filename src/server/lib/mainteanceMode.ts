import { checkUser, scriptPropertiesService } from './utils';

export const isMaintenance = async (): Promise<void> => {
  const scriptProperties = scriptPropertiesService.getProperties();

  if (scriptProperties.mainteance === 'false' || (await checkUser('superAdmin'))) return;

  throw new Error('maintenance mode activated');
};

export const enableMaintenance = async (): Promise<void> => {
  console.info('enable Maintenance');

  await checkUser('superAdmin');

  scriptPropertiesService.setProperty('maintenanceMode', 'true');

  console.info('maintenanceMode: true');
};

export const disableMaintenance = async (): Promise<void> => {
  console.info('disable Maintenance');

  await checkUser('superAdmin');

  scriptPropertiesService.setProperty('maintenanceMode', 'false');

  console.info('maintenanceMode: false');
};
