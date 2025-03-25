import { checkUser } from '../lib/utils';
import { getSubmits } from './getSubmits';

import type { SubmitType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export interface DelSubmitArgs {
  query: SubmitType['query'];
}

export const delSubmit = async ({ query }: DelSubmitArgs): Promise<void> => {
  console.info('delSubmit ~ args:', { query });

  isMaintenance();

  if (!(await checkUser('superAdmin'))) throw new Error('delSubmit ~ Unauthorized');

  const submits = await getSubmits({});

  if (!submits) throw new Error('delSubmit ~ Submits not found');

  const submitFound = submits.find(
    (s) => s.query?.id === query?.id && s.query?.name === query?.name && s.query?.version === query?.version,
  );

  if (!submitFound) throw new Error('delSubmit ~ Submit not found');

  const result = [];
  for (const s of submits) {
    if (s.query?.id === query?.id && s.query?.name === query?.name && s.query?.version === query?.version) continue;

    result.push(s);
  }

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  scriptPropertiesService.setProperty('submits', JSON.stringify(result));

  console.info('delSubmit ~ result:', result);
};
