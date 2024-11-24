import { getUser } from './getUser';

import { Submit, type SubmitType } from '$types/schemas';
import { checkUser } from '../lib/utils';
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

  if (!submits) throw new Error('Submits not found');

  const submitFound = submits.find(
    (s) =>
      s.query?.id === submit.query?.id &&
      s.query?.name === submit.query?.name &&
      s.query?.version === submit.query?.version,
  );

  if (!submitFound) throw new Error('Submit not found');

  if (submitFound.status === 'validated') throw new Error('Submit already validated');

  if (type !== 'validated' && type !== 'rejected') throw new Error('invalid type');

  let confirmed: boolean | undefined;

  const result = submits.map((s) => {
    if (
      s.query?.id === submit.query?.id &&
      s.query?.name === submit.query?.name &&
      s.query?.version === submit.query?.version
    )
      return s;

    s.status = type;
    s.reason = submit.reason;

    confirmed = true;

    if (type === 'validated') s.game = submit.game;

    return s;
  });

  if (!confirmed) throw new Error('Submit not found');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty('submits', JSON.stringify(result));

  console.info('putSubmit() called with: ', result);
};
