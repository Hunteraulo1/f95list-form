import sleep from '../sleep';

import { User, UserType } from '$types/schemas';
import { parse } from 'valibot';

interface PutUserArgs {
  user: UserType;
}

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = async ({ user }: PutUserArgs): Promise<void> => {
  await sleep();

  parse(User, user);

  console.info('putUser() called with: ', user);
};

export const putUserRole = async ({ user }: PutUserArgs): Promise<void> => {
  await sleep();

  parse(User, user);

  console.info('putUserRole() called with: ', user);
};
