import type { UserType } from '$types/schemas';
import checkUser from '../lib/checkUser';

/**
 * **API Endpoint** | Returns the accessing user object
 */
export const getUsers = (): UserType[] | undefined => {
  const requestingUserEmail = Session.getActiveUser().getEmail();
  // Report request
  console.info('getUsers called by: ', requestingUserEmail);

  checkUser('admin');

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const scriptPropertiesEntries = Object.entries(scriptProperties);

  const users: UserType[] = [];

  // Check if scriptProperties is an array or iterable object
  for (const user of scriptPropertiesEntries) {
    const [key, value] = user;
    if (!key.includes('@')) return;

    users.push(JSON.parse(value));
  }

  // Otherwise, the user object exists and we can return it.
  return users;
};
