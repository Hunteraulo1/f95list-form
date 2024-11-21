import checkUser from '$lib/checkUser';
import sleep from '$lib/sleep';
import type { UserType } from '$types/schemas';
import { user, users } from '../data/user';

interface GetUserArgs {
  email: UserType['email'] | null;
}

export const getUser = async ({ email }: GetUserArgs = { email: null }): Promise<UserType | null> => {
  await sleep();

  let mockResponse = null;

  console.info({ email });

  if (email) {
    if (!checkUser(['admin', 'superAdmin']) && email !== user.email) throw new Error('Unauthorized');

    const findUser = users.find((user) => user.email === email);
    if (findUser) {
      mockResponse = findUser;
    }
  } else {
    mockResponse = user;
  }

  console.info('mockResponse', mockResponse);

  return JSON.parse(JSON.stringify(mockResponse));
};
