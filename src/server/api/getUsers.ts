import { checkUser } from '../lib/utils';

import type { UserType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export const getUsers = async (): Promise<UserType[] | undefined> => {
  console.info('getUsers');

  isMaintenance();

  const requestingUserEmail = Session.getActiveUser().getEmail();

  console.info('getUsers called by: ', requestingUserEmail);

  await checkUser('admin');

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
