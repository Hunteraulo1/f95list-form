import { users } from '../data/user';
import sleep from '../sleep';

import { UserType } from '$types/schemas';

export const getUsers = async (): Promise<UserType[]> => {
  await sleep();

  console.info('mockResponse', users);

  return JSON.parse(JSON.stringify(users));
};
