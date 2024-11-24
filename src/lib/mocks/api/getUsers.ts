import sleep from '$lib/sleep';
import { users } from '../data/user';

import type { UserType } from '$types/schemas';

export const getUsers = async (): Promise<UserType[]> => {
  await sleep();

  return JSON.parse(JSON.stringify(users));
};
