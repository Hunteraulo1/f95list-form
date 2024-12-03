import { User } from '$types/schemas';
import { object } from 'zod';
import { user as userData, users as usersData } from '../data/user';
import { checkUser } from '../utils';
import { postUser } from './postUser';

import type { UserType } from '$types/schemas';

export type GetUserArgs = {
  email: string | null;
};

export const getUser = async ({ email }: GetUserArgs = { email: null }): Promise<UserType> => {
  console.info('getUser ~ args:', { email });

  const requestingUserEmail = userData.email;

  let validArgs = null;

  if (email) {
    if (!(await checkUser('admin')) && email !== requestingUserEmail) throw new Error('getUser ~ Unauthorized');

    const GetUserArgsSchema = object({
      email: User.shape.email,
    });
    validArgs = GetUserArgsSchema.parse({ email });
  }

  const EMAIL_FOR_RETRIEVAL = validArgs?.email ?? requestingUserEmail;
  console.info({ EMAIL_FOR_RETRIEVAL });

  const userObjectString = usersData.find((user) => user.email === EMAIL_FOR_RETRIEVAL);

  const isRequestForSelf = requestingUserEmail === EMAIL_FOR_RETRIEVAL;

  if (!userObjectString && !isRequestForSelf) {
    throw new Error('getUser ~ User not found');
  }

  if (!EMAIL_FOR_RETRIEVAL) throw new Error('getUser ~ email not found');

  if (!userObjectString && isRequestForSelf) return postUser(EMAIL_FOR_RETRIEVAL);

  console.info(userObjectString);

  return userObjectString as UserType;
};
