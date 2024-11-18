import { User, type UserType } from '$types/schemas';
import { getUser } from '../api/getUser';

const checkUser = (rank: UserType['roles'][0]): boolean => {
  const user = getUser();

  console.info('checkUser() called with: ', user, 'by: ', user.email);

  const validUser = User.parse(user);

  if (!validUser.email || (!validUser.roles.includes(rank) && !validUser.roles.includes('superAdmin'))) return false;

  return true;
};

export default checkUser;
