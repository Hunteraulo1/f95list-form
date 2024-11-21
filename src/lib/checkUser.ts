import { User, type UserType } from '$types/schemas';
import { sessionUser } from './stores';

const checkUser = (ranks: UserType['roles']): boolean => {
  let user: UserType | null = null;

  sessionUser.subscribe((u) => {
    user = u;
  });

  if (!user) throw new Error('User not found');

  const validUser = User.parse(user);

  for (const rank of ranks) {
    if (validUser.roles.includes(rank)) return true;
  }

  return false;
};

export default checkUser;
