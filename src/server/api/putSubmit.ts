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

  const validStatus = Submit.shape.status.parse(status)
  if (!validStatus) throw new Error('putSubmitStatus ~ Invalid submit status');

  const user = getUser({ email: submit.email });
  if (!user) throw new Error('putSubmit ~ User not found');

  const submits = await getSubmits({});

  if (!submits) throw new Error('putSubmit ~ Submits not found');

  const submitFound = submits.find(
    (s) =>
      s.query?.id === submit.query?.id &&
      s.query?.name === submit.query?.name &&
      s.query?.version === submit.query?.version &&
      s.status === 'wait',
  );

  if (!submitFound) throw new Error('putSubmit ~ Submit not found');

  let confirmed = false;

  const result = submits.map((s) => {
    if (
      s.query?.id !== submit.query?.id ||
      s.query?.name !== submit.query?.name ||
      s.query?.version !== submit.query?.version
    )
      return s;

    s.status = validStatus;
    s.reason = submit.reason;

    confirmed = true;

    if (status === 'validated') s.game = submit.game;

    return s;
  });

  if (!confirmed) throw new Error('putSubmit ~ Submit not found');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty('submits', JSON.stringify(result));

  console.info('putSubmit ~ result:', result);
};

export interface PutSubmitStatusArgs {
  query: SubmitType['query'];
  status: string;
}

export const putSubmitStatus = async ({ query, status }: PutSubmitStatusArgs): Promise<void> => {
  console.info('putSubmitStatus ~ args:', { query, type: status });

  if (!checkUser('admin')) throw new Error('putSubmitStatus ~ Unauthorized');

  const validSubmit = Submit.shape.query.parse(query);
  if (!validSubmit) throw new Error('putSubmitStatus ~ Invalid submit');

  const validStatus = Submit.shape.status.parse(status)
  if (!validStatus) throw new Error('putSubmitStatus ~ Invalid submit status');

  const submits = await getSubmits({});

  if (!submits) throw new Error('putSubmitStatus ~ Submits not found');

  const submitFound = submits.find(
    (s) =>
      s.query?.id === query?.id &&
      s.query?.name === query?.name &&
      s.query?.version === query?.version
  );

  if (!submitFound) throw new Error('putSubmitStatus ~ Submit not found');

  let confirmed = false;

  const result = submits.map((s) => {
    if (
      s.query?.id !== query?.id ||
      s.query?.name !== query?.name ||
      s.query?.version !== query?.version
    )
      return s;

    s.status = validStatus;

    confirmed = true;

    return s;
  });

  if (!confirmed) throw new Error('putSubmitStatus ~ Submit not found');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty('submits', JSON.stringify(result));

  console.info('putSubmitStatus ~ result:', result);
};
