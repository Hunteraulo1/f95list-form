import { User } from '$types/schemas';

import type { SubmitType, UserType } from '$types/schemas';

export interface GetSubmitsArgs {
  user?: UserType;
}

export const getSubmits = ({ user }: GetSubmitsArgs): SubmitType[] | undefined => {
  console.info('getSubmits ~ args:', { user });

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const submits: SubmitType[] = JSON.parse(scriptProperties.submits);

  if (user) {
    const validUser = User.parse(user);

    const { email } = validUser;

    const filteredSubmits = submits.filter((submit) => submit.email === email);

    console.info('getSubmits ~ filteredSubmits: ', filteredSubmits);

    return filteredSubmits;
  }

  console.info('getSubmits ~ submits: ', submits);

  return submits;
};
