import { User } from '$types/schemas';
import { getUser } from '../api/getUser';

import type { UserType } from '$types/schemas';

const checkUser = async (rank: UserType['role'][0]): Promise<boolean> => {
  console.info('checkUser');

  const user = await getUser();

  console.info('checkUser() called with: ', user, 'by: ', user.email);

  const validUser = User.parse(user);

  if (validUser.role.includes(rank) || validUser.role.includes('superAdmin')) return true;

  return false;
};

const dateNow = (): string => new Date().toISOString();

export { checkUser, dateNow };
