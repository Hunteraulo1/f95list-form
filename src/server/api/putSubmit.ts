import { Submit } from '$types/schemas';
import { checkUser } from '../lib/utils';
import { getSubmits } from './getSubmits';
import { getUser } from './getUser';

import type { SubmitType } from '$types/schemas';

export interface PutSubmitArgs {
  submit: SubmitType;
  status: string;
}

export const putSubmit = async ({ submit, status }: PutSubmitArgs): Promise<void> => {
  console.info('putSubmit ~ args:', { submit, type: status });

  if (!checkUser('admin')) throw new Error('putSubmit ~ Unauthorized');

  const validSubmit = Submit.parse(submit);
  if (!validSubmit) throw new Error('putSubmit ~ Invalid submit');

  const user = getUser({ email: submit.email });
  if (!user) throw new Error('putSubmit ~ User not found');

  const submits = await getSubmits({});

  if (!submits) throw new Error('putSubmit ~ Submits not found');

  const submitFound = submits.find(
    (s) =>
      s.query?.id === submit.query?.id &&
      s.query?.name === submit.query?.name &&
      s.query?.version === submit.query?.version,
  );

  if (!submitFound) throw new Error('putSubmit ~ Submit not found');

  if (submitFound.status === 'validated') throw new Error('putSubmit ~ Submit already validated');

  if (status !== 'validated' && status !== 'rejected') throw new Error('putSubmit ~ invalid type');

  let confirmed = false;

  const result = submits.map((s) => {
    if (
      s.query?.id !== submit.query?.id ||
      s.query?.name !== submit.query?.name ||
      s.query?.version !== submit.query?.version
    )
      return s;

    s.status = status;
    s.reason = submit.reason;

    confirmed = true;

    if (status === 'validated') s.game = submit.game;

    console.log('🚀 ~ result ~ s:', s);

    return s;
  });

  if (!confirmed) throw new Error('putSubmit ~ Submit not found');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty('submits', JSON.stringify(result));

  console.info('putSubmit ~ result:', result);
};
