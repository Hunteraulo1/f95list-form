import { User } from '$types/schemas';

import type { SubmitType, UserType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export interface GetSubmitsArgs {
  user?: UserType;
}

export const getSubmits = async ({ user }: GetSubmitsArgs): Promise<SubmitType[]> => {
  console.info('getSubmits ~ args:', { user });

  isMaintenance();

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const submits: SubmitType[] = JSON.parse(scriptProperties.submits);
  console.info('getSubmits ~ submits: ', submits);

  if (!user) return submits;

  const validUser = User.parse(user);

  const { email } = validUser;

  const filteredSubmits = submits.filter((submit) => submit.email === email);

  console.info('getSubmits ~ filteredSubmits: ', filteredSubmits);

  return filteredSubmits;
};
