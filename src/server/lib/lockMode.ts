import { scriptPropertiesService } from './utils';

let inProgress = false;

const isLocked = (): boolean | undefined => {
  const scriptProperties = scriptPropertiesService.getProperties();

  return scriptProperties.lockMode === 'true';
};

export const enableLock = (): void => {
  console.info('enableLock');

  if (isLocked()) throw new Error('Lock mode already enabled');

  scriptPropertiesService.setProperty('lockMode', 'true');
  inProgress = true;

  console.info('lockMode: true');
};

export const disableLock = (): void => {
  console.info('disableLock');

  if (!inProgress) return;

  scriptPropertiesService.setProperty('lockMode', 'false');

  console.info('lockMode: false');
};
