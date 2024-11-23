import { type SubmitType, User, type UserType } from '$types/schemas';

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

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const submits: SubmitType[] = JSON.parse(scriptProperties.submits);

  if (user) {
    const validUser = User.parse(user);

    const { email } = validUser;

    const filteredSubmits = submits.filter((submit) => submit.email === email);

    console.info('getSubmits filteredSubmits: ', filteredSubmits);

    return filteredSubmits;
  }

  console.info('getSubmits submits: ', submits);

  return submits;
};
