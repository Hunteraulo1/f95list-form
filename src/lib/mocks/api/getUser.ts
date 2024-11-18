import sleep from '$lib/sleep';
import { user, users } from '../data/user';

import type { UserType } from '$types/schemas';

interface GetUserArgs {
  email: UserType['email'] | null;
}

export const getUser = async ({ email }: GetUserArgs = { email: null }): Promise<UserType | null> => {
  await sleep();

  let mockResponse = null;

  console.info({ email });

  if (email) {
    const user = users.find((user) => user.email === email);
    if (user) {
      mockResponse = user;
    }
  } else {
    mockResponse = user;
  }

  console.info('mockResponse', mockResponse);

  return JSON.parse(JSON.stringify(mockResponse));
};
