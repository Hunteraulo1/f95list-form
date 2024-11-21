import checkUser from '$lib/checkUser';
import sleep from '$lib/sleep';

import { Submit, type SubmitType } from '$types/schemas';
import { getSubmits } from './getSubmits';
import { getUser } from './getUser';

interface PutSubmitArgs {
  submit: SubmitType;
  type: string;
}

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putSubmit = async ({ submit, type }: PutSubmitArgs): Promise<void> => {
  await sleep();

  if (!checkUser(['admin', 'superAdmin'])) throw new Error('Unauthorized');

  const validSubmit = Submit.parse(submit);
  if (!validSubmit) throw new Error('Invalid submit');

  const user = await getUser({ email: submit.email });
  if (!user) throw new Error('User not found');

  const submits = await getSubmits({ user });
  if (!submits || !submits.find((s) => s.query === submit.query)) throw new Error('Submit(s) not found');

  if (type !== 'validated' && type !== 'rejected') throw new Error('invalid type');

  validSubmit.status = type;

  console.info('putSubmit() called with: ', validSubmit);
};
