import { User, type UserType } from '$types/schemas';
import { getUser } from '../api/getUser';

const checkUser = (rank: UserType['role'][0]): boolean => {
  const user = getUser();

  console.info('checkUser() called with: ', user, 'by: ', user.email);

  const validUser = User.parse(user);

  if (validUser.role.includes(rank) || validUser.role.includes('superAdmin')) return true;

  return false;
};

const dateNow = () => new Date().toISOString();

export { checkUser, dateNow };
