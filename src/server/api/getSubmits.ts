import { type SubmitType, User, type UserType } from '$types/schemas';
import checkUser from '../lib/checkUser';

export interface GetSubmitsArgs {
  user?: UserType;
}

/**
 * **API Endpoint** | Returns the accessing submits object
 */
export const getSubmits = ({ user }: GetSubmitsArgs): SubmitType[] | undefined => {
  const requestingUserEmail = Session.getActiveUser().getEmail();
  // Report request
  console.info('getSubmits called by: ', requestingUserEmail);

  if (!checkUser('traductor') || (!user && !checkUser('admin'))) throw new Error('Unauthorized');

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const submits: SubmitType[] = JSON.parse(scriptProperties.submits);

  if (user) {
    const validUser = User.parse(user);

    const { email } = validUser;

    return submits.filter((submit) => submit.email === email);
  }

  return submits;
};
