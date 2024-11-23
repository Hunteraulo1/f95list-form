import sleep from '$lib/sleep';
import { checkUser } from '$lib/utils';
import { type SubmitType, User, type UserType } from '$types/schemas';
import { submits } from '../data/submit';

interface GetSubmitsArgs {
  user?: UserType;
}

export const getSubmits = async ({ user }: GetSubmitsArgs): Promise<SubmitType[] | null> => {
  await sleep();

  if (!checkUser(['traductor', 'admin', 'superAdmin']) || (!user && !checkUser(['admin', 'superAdmin'])))
    throw new Error('Unauthorized');

  if (user) {
    const validUser = User.parse(user);

    const { email } = validUser;

    return submits.filter((submit) => submit.email === email);
  }

  return submits;
};
