const scriptPropertiesService = PropertiesService.getScriptProperties();
let inProgress = false;

const isLocked = (): boolean | undefined => {
  const scriptProperties = scriptPropertiesService.getProperties();

  return scriptProperties.lockMode === 'true';
};

export const enableLock = () => {
  if (isLocked()) throw new Error('Lock mode already enabled');

  scriptPropertiesService.setProperty('lockMode', 'true');
  inProgress = true;

  console.log('lockMode: true');
};

export const disableLock = () => {
  if (!inProgress) return;

  scriptPropertiesService.setProperty('lockMode', 'false');

  console.log('lockMode: false');
};
