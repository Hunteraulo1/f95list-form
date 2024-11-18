import { User, type UserType } from '$types/schemas';
import { sessionUser } from './stores';

const checkUser = (rank: UserType['roles'][0]): boolean => {
  let user: UserType | null = null;

  sessionUser.subscribe((u) => {
    user = u;
  });

  if (!user) throw new Error('User not found');

  const validUser = User.parse(user);

  console.info('checkUser() called with: ', validUser, 'by: ', validUser.email);

  if (validUser.roles.includes(rank) || validUser.roles.includes('superAdmin')) return true;

  return false;
};

export default checkUser;
