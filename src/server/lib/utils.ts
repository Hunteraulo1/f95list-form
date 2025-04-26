import { User } from '$types/schemas';
import { getUser } from '../api/getUser';

import type { UserType } from '$types/schemas';

const checkUser = async (rank: UserType['role']): Promise<boolean> => {
  console.info('checkUser');

  const user = await getUser({ email: 'ignore' });

  console.info('checkUser called with: ', user, 'by: ', user.email);

  const validUser = User.parse(user);

  if (!validUser) throw new Error('user not valid');

  const result = validUser.role === rank || validUser.role === 'superAdmin';

  console.info('checkUser result: ', result);

  return result;
};

const dateNow = (): string => new Date().toISOString();

const unescapeHTML = (str: string): string =>
  str.replace(
    /&amp;|&lt;|&gt;|&#39;|&quot;/g,
    (tag) =>
      ({
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&#39;': "'",
        '&quot;': '"',
      })[tag] || tag,
  );

const doLogout = (): void => {
  ScriptApp.invalidateAuth();
};

export { checkUser, dateNow, doLogout, unescapeHTML };
