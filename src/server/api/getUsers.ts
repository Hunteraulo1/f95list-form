import { checkUser } from '../lib/utils';

import type { UserType } from '$types/schemas';

export const getUsers = (): UserType[] | undefined => {
  console.info('getUsers');
  const requestingUserEmail = Session.getActiveUser().getEmail();

  console.info('getUsers called by: ', requestingUserEmail);

  checkUser('admin');

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const scriptPropertiesEntries = Object.entries(scriptProperties);

  const users: UserType[] = [];

  for (const user of scriptPropertiesEntries) {
    console.info('🚀 ~ getUsers ~ user:', user);
    const [key, value] = user;
    if (!key.includes('@')) continue;

    users.push(JSON.parse(value));
  }

  return users;
};
