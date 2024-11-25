import { get, writable } from 'svelte/store';

let inProgress = false;

const lockMode = writable<boolean>();

const isLocked = (): boolean | undefined => get(lockMode);

export const enableLock = (): void => {
  console.info('enableLock');

  if (isLocked()) throw new Error('Lock mode already enabled');

  lockMode.set(true);
  inProgress = true;
};

export const disableLock = (): void => {
  console.info('disableLock');

  if (!inProgress) return;

  lockMode.set(false);
};
