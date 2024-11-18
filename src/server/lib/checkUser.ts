import { User, type UserType } from '$types/schemas';
import { getUser } from '../api/getUser';

const checkUser = (rank: UserType['roles'][0]): boolean => {
  const activeUserEmail = Session.getActiveUser().getEmail();
  const effectiveUserEmail = Session.getEffectiveUser().getEmail();

  if (activeUserEmail !== effectiveUserEmail)
    throw new Error('A user resource can only be updated by themselves or the superAdmin.');

  const user = getUser({ email: activeUserEmail });

  console.info('checkUser() called with: ', user, 'by: ', effectiveUserEmail);

  const validUser = User.parse(user);

  if (!validUser.email) throw new Error('No email found');

  if (validUser.roles.includes(rank) || validUser.roles.includes('superAdmin')) return true;

  return false;
};

export default checkUser;
