const scriptPropertiesService = PropertiesService.getScriptProperties();
let inProgress = false;

const isLocked = (): boolean | undefined => {
  const scriptProperties = scriptPropertiesService.getProperties();

  return scriptProperties.lockMode === 'true';
};

export const enableLock = (): void => {
  console.groupCollapsed('enableLock');

  if (isLocked()) throw new Error('Lock mode already enabled');

  scriptPropertiesService.setProperty('lockMode', 'true');
  inProgress = true;

  console.info('lockMode: true');

  console.groupEnd();
};

export const disableLock = (): void => {
  console.groupCollapsed('disableLock');

  if (!inProgress) return;

  scriptPropertiesService.setProperty('lockMode', 'false');

  console.info('lockMode: false');

  console.groupEnd();
};
