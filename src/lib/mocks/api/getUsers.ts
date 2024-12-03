import { user, users } from '../data/user';
import { checkUser } from '../utils';

import type { UserType } from '$types/schemas';

export const getUsers = async (): Promise<UserType[]> => {
  console.info('getUsers');

  const requestingUserEmail = user.email;

  console.info('getUsers called by: ', requestingUserEmail);

  if (!(await checkUser('admin'))) throw new Error('getUsers ~ Unauthorized');

  return users;
};
