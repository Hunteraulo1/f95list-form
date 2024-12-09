import { User, type UserType } from '$types/schemas';
import { sessionUser } from './stores';

const checkUser = (ranks: UserType['role'][]): boolean => {
  let user: UserType | null = null;

  sessionUser.subscribe((u) => {
    user = u;
  });

  if (!user) throw new Error('User not found');

  const validUser = User.parse(user);

  return ranks.includes(validUser.role);
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const dateFormat = (date: Date): string => date.toLocaleString('fr-FR', dateFormatOptions);

export { checkUser, dateFormat };
