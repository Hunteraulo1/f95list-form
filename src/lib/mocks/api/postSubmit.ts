import sleep from '$lib/sleep';

import { PostSubmit, type PostSubmitType, type SubmitType } from '$types/schemas';
import { dateNow } from '../../../server/lib/utils';
import { getUser } from './getUser';

export const postSubmit = async ({ query, game, type, comment }: PostSubmitType): Promise<void> => {
  await sleep();

  const validSubmit = PostSubmit.parse({ query, game, type, comment });

  const requestingUser = await getUser();

  if (!requestingUser) throw new Error('user not found');

  const submit: SubmitType = {
    email: requestingUser.email,
    date: dateNow(),
    status: 'wait',
    reason: '',
    ...validSubmit,
  };
};
