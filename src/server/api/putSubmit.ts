import { getUser } from './getUser';

import { Submit, type SubmitType } from '$types/schemas';
import checkUser from '../lib/checkUser';
import { getSubmits } from './getSubmits';

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */

export interface PutSubmitArgs {
  submit: SubmitType;
  type: string;
}

export const putSubmit = async ({ submit, type }: PutSubmitArgs): Promise<void> => {
  if (!checkUser('admin')) throw new Error('Unauthorized');

  const validSubmit = Submit.parse(submit);
  if (!validSubmit) throw new Error('Invalid submit');

  const user = await getUser({ email: submit.email });
  if (!user) throw new Error('User not found');

  const submits = await getSubmits({});
  if (!submits || !submits.find((s) => s.query === submit.query)) throw new Error('Submit(s) not found');

  if (type !== 'validated' && type !== 'rejected') throw new Error('invalid type');

  const result = submits.map((s) => {
    if (s.query !== submit.query) return s;

    s.status = type;
    s.reason = submit.reason;

    if (type === 'validated') s.game = submit.game;

    return s;
  });

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty('submits', JSON.stringify(result));

  console.info('putSubmit() called with: ', result);
};
