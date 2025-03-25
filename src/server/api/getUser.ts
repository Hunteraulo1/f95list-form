import { User } from '$types/schemas';
import { z } from 'zod';
import { checkUser } from '../lib/utils';
import { postUser } from './postUser';

import type { UserType } from '$types/schemas';
import { isMaintenance } from '../lib/mainteanceMode';

export type GetUserArgs = {
  email: string | null;
};

export const getUser = async ({ email }: GetUserArgs = { email: null }): Promise<UserType> => {
  console.info('getUser ~ args:', { email });

  isMaintenance();

  const requestingUserEmail = Session.getActiveUser().getEmail();

  let validArgs = null;

  if (email && email !== 'ignore') {
    if (!(await checkUser('admin')) && email !== requestingUserEmail) throw new Error('getUser ~ Unauthorized');

    const GetUserArgsSchema = z.object({
      email: User.shape.email,
    });
    validArgs = GetUserArgsSchema.parse({ email });
  }

  const EMAIL_FOR_RETRIEVAL = validArgs?.email ?? requestingUserEmail;
  console.info({ EMAIL_FOR_RETRIEVAL });

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const userObjectString = scriptProperties[EMAIL_FOR_RETRIEVAL];

  const isRequestForSelf = requestingUserEmail === EMAIL_FOR_RETRIEVAL;

  if (!userObjectString && !isRequestForSelf) {
    throw new Error('getUser ~ User not found');
  }

  if (!userObjectString && isRequestForSelf) return postUser(EMAIL_FOR_RETRIEVAL);

  const parseUser: UserType = JSON.parse(userObjectString);
  const devUserEmail = parseUser.preferences?.devUser;

  if (devUserEmail && parseUser.email !== devUserEmail && email !== 'ignore') {
    const devUserObjectString = scriptProperties[devUserEmail];
    const devUserParse: UserType = JSON.parse(devUserObjectString);

    if (devUserParse?.email) {
      console.info(`getUser ~ return ${devUserEmail} by devUser`);
      return User.parse(devUserParse);
    }
  }

  return User.parse(parseUser);
};
