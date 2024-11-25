import { checkUser } from '../../../server/lib/utils';
import { users } from '../data/user';

import type { UserType } from '$types/schemas';

export const getUsers = (): UserType[] | undefined => {
  console.info('getUsers');

  const requestingUserEmail = Session.getActiveUser().getEmail();

  console.info('getUsers called by: ', requestingUserEmail);

  checkUser('admin');

  return users;
};
