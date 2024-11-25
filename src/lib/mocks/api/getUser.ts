import { User } from '$types/schemas';
import { object as zObject } from 'zod';
import { checkUser } from '../../../server/lib/utils';
import { postUser } from './postUser';

import type { UserType } from '$types/schemas';
import { user as userData, users as usersData } from '../data/user';

export type GetUserArgs = {
  email: string | null;
};

export const getUser = ({ email }: GetUserArgs = { email: null }): UserType => {
  console.info('getUser ~ args:', { email });

  const requestingUserEmail = userData.email;

  let validArgs = null;

  if (email) {
    if (!checkUser('admin') && email !== requestingUserEmail) throw new Error('getUser ~ Unauthorized');

    const GetUserArgsSchema = zObject({
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
