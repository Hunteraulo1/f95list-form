import sleep from '$lib/sleep';

import { PostSubmit, type PostSubmitType, type SubmitType } from '$types/schemas';
import { getUser } from './getUser';

export const postSubmit = async ({ game, type, comment }: PostSubmitType): Promise<void> => {
  console.info('postSubmit called with args:', { dataSubmit: { game, type, comment } });

  await sleep();

  const validSubmit = PostSubmit.parse({ game, type, comment });

  const requestingUser = await getUser();

  if (!requestingUser) throw new Error('user not found');

  const submit: SubmitType = {
    email: requestingUser.email,
    date: new Date().toISOString(),
    status: 'wait',
    reason: '',
    ...validSubmit,
  };

  console.info('mockResponse_postSubmit', { submit });
};
