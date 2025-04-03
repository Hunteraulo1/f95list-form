import { User, type UserType } from '$types/schemas';
import { GAS_API } from './GAS_API';
import { sessionUser, submitsCount } from './stores';

const checkUser = (ranks: UserType['role'][]): boolean => {
  let user: UserType | null = null;

  sessionUser.subscribe((u) => {
    user = u;
  });

  if (!user) throw new Error('User not found');

  const validUser = User.parse(user);

  return ranks.includes(validUser.role);
};

const checkSubmits = async (): Promise<void> => {
  if (!checkUser(['admin', 'superAdmin'])) return;

  const submits = await GAS_API.getSubmits({});

  if (!submits) return;

  const submitsWait = submits.filter((submit) => submit.status === 'wait');

  submitsCount.set(submitsWait.length);
};

const dateFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

const dateFormat = (date: Date): string => date.toLocaleString('fr-FR', dateFormatOptions);

export { checkSubmits, checkUser, dateFormat };
