import { getUser } from './getUser';

import { User, type UserType } from '$types/schemas';
import { checkUser, dateNow } from '../lib/utils';

export type PutUserArgs = {
  user: UserType;
  role?: UserType['role'];
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = ({ user }: PutUserArgs) => {
  const activeUserEmail = Session.getActiveUser().getEmail();
  const effectiveUserEmail = Session.getEffectiveUser().getEmail();

  console.info('putUser() called with: ', user, 'by: ', activeUserEmail);

  const validUser = User.parse(user);

  if (!validUser.email) throw new Error('No email found');

  if (validUser.role.includes('superAdmin') && activeUserEmail !== effectiveUserEmail)
    throw new Error('A user resource can only be updated by themselves or the superAdmin.');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  const properties: UserType = JSON.parse(scriptPropertiesService.getProperty(validUser.email) ?? '');

  properties.profile = validUser.profile;

  if (JSON.stringify(validUser.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: dateNow(),
      label: 'Utilisateur mis à jour',
    });
  }

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validUser));

  console.info('User successfully saved.');
};

export const putUserRole = ({ user, role }: PutUserArgs): void => {
  if (!role) throw new Error('No role found');

  console.info('putUserRole() called with: ', user, 'by: ', Session.getActiveUser().getEmail());

  const validUser = User.parse(user);

  if (!validUser) throw new Error('Invalid user');
  if (!checkUser('admin')) throw new Error('A user permission is required to update a user role.');

  if (checkUser('admin') && ['admin', 'superAdmin'].includes(role))
    throw new Error('A user resource can only be updated by superAdmin.');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!validUser.email) throw new Error('No email found');

  const userScriptPropertiesUser = scriptPropertiesService.getProperty(validUser.email);

  if (!userScriptPropertiesUser) throw new Error('No user found');

  const properties: UserType = JSON.parse(userScriptPropertiesUser);

  properties.role = validUser.role;

  if (JSON.stringify(validUser.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: dateNow(),
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
