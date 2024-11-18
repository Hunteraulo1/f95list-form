import { getUser } from './getUser';

import { User, type UserType } from '$types/schemas';

export type PutUserArgs = {
  user: UserType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = ({ user }: PutUserArgs) => {
  const invokingUserEmail = Session.getActiveUser().getEmail();

  console.info('putUser() called with: ', user, 'by: ', invokingUserEmail);

  const validUser = User.parse(user);

  if (!validUser.email) throw new Error('No email found');

  if (validUser.roles.includes('superAdmin') && invokingUserEmail !== Session.getEffectiveUser().getEmail())
    throw new Error('A user resource can only be updated by themselves or the superAdmin.');
  
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  const properties: UserType = JSON.parse(scriptPropertiesService.getProperty(validUser.email) ?? '');

  properties.profile = validUser.profile;

  if (JSON.stringify(validUser.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: new Date().toISOString(),
      label: 'Utilisateur mis à jour',
    });
  }

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validUser));

  console.info('User successfully saved.');
};

export const putUserRole = ({ user }: PutUserArgs) => {
  const invokingUserEmail = Session.getActiveUser().getEmail();

  console.info('putUserRole() called with: ', user, 'by: ', invokingUserEmail);

  const validUser = User.parse(user);

  if (validUser.roles.includes('superAdmin') && invokingUserEmail !== Session.getEffectiveUser().getEmail())
    throw new Error('A user resource can only be updated by themselves or the superAdmin.');

  // If the code reaches here, the user object is valid
  // and the invoking user is either the user or a superAdmin.
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!validUser.email) throw new Error('No email found');

  const properties: UserType = JSON.parse(scriptPropertiesService.getProperty(validUser.email) ?? '{}');

  if (!properties) throw new Error('No roles found');

  properties.roles = validUser.roles;

  if (JSON.stringify(validUser.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: new Date().toISOString(),
      label: 'Utilisateur mis à jour',
    });
  }

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validUser));

  console.info('User successfully saved.');
};

export const putStatistics = (type: 'put' | 'post'): void => {
  console.info('putUserRole() called with: ', type);

  const validUser = User.parse(getUser());

  if (!validUser.email) throw new Error('No email found');

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const userScriptPropertiesService: UserType = JSON.parse(
    scriptPropertiesService.getProperty(validUser.email) ?? '{}',
  );

  const result: UserType['statistics'] = userScriptPropertiesService.statistics;

  if (!result) throw new Error('No statistics found');

  switch (type) {
    case 'post':
      scriptPropertiesService.setProperty('statistics', JSON.stringify(result.gameAdded + 1));
      break;
    case 'put':
      scriptPropertiesService.setProperty('statistics', JSON.stringify(result.gameEdited + 1));
  }
};
