import { getUser } from './getUser';

import { User, type UserType } from '$types/schemas';
import { checkUser, dateNow } from '../lib/utils';

export interface PutUserArgs {
  user: UserType;
  role?: UserType['role'];
}

export const putUser = async ({ user }: PutUserArgs): Promise<void> => {
  console.info('putUser ~ args:', { user });

  const activeUserEmail = Session.getActiveUser().getEmail();
  const effectiveUserEmail = Session.getEffectiveUser().getEmail();

  console.info('putUser ~ called by: ', activeUserEmail);

  const validUser = User.parse(user);

  if (!validUser.email) throw new Error('putUser ~ No email found');

  if (validUser.role.includes('superAdmin') && activeUserEmail !== effectiveUserEmail)
    throw new Error('putUser ~ A user resource can only be updated by themselves or the superAdmin.');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  const properties: UserType = JSON.parse(scriptPropertiesService.getProperty(validUser.email) ?? '');

  const { preferences, profile, activity } = validUser;
  const newUser: UserType = {
    ...properties,
    preferences,
    profile,
  };

  if (JSON.stringify(validUser.activity) === JSON.stringify(activity)) {
    newUser.activity.push({
      value: dateNow(),
      label: 'Utilisateur mis à jour',
    });
  }

  const validNewUser = User.parse(newUser);

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validNewUser));

  console.info('putUser ~ successfully saved.');
};

export const putUserRole = async ({ user, role }: PutUserArgs): Promise<void> => {
  console.info('putUserRole ~ args:', { user, role });

  if (!role) throw new Error('putUserRole ~ No role found');

  console.info('putUserRole ~ called by: ', Session.getActiveUser().getEmail());

  const validUser = User.parse(user);

  if (!checkUser('admin')) throw new Error('putUserRole ~ A user permission is required to update a user role.');

  if (!checkUser('superAdmin') && ['admin', 'superAdmin'].includes(role))
    throw new Error('putUserRole ~ A user resource can only be updated by superAdmin.');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!validUser.email) throw new Error('putUserRole ~ No email found');

  const userScriptPropertiesUser = scriptPropertiesService.getProperty(validUser.email);

  if (!userScriptPropertiesUser) throw new Error('putUserRole ~ No user found');

  const properties: UserType = JSON.parse(userScriptPropertiesUser);

  const { preferences, profile, activity } = validUser;
  const newUser: UserType = {
    ...properties,
    role,
    preferences,
    profile,
  };

  if (JSON.stringify(validUser.activity) === JSON.stringify(activity)) {
    newUser.activity.unshift({
      value: dateNow(),
      label: 'Rôle changé',
    });
  }

  const validNewUser = User.parse(newUser);

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validNewUser));

  console.info('putUserRole ~ successfully saved.');
};

export const putStatistics = async (type: 'put' | 'post'): Promise<void> => {
  console.info('putStatistics ~ args:', { type });

  const validUser = User.parse(getUser());

  if (!validUser.email) throw new Error('putStatistics ~ No email found');

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const userScriptPropertiesService: UserType = JSON.parse(
    scriptPropertiesService.getProperty(validUser.email) ?? '{}',
  );

  const result: UserType['statistics'] = userScriptPropertiesService.statistics;

  if (!result) throw new Error('putStatistics ~ No statistics found');

  switch (type) {
    case 'post':
      scriptPropertiesService.setProperty('statistics', JSON.stringify(result.gameAdded + 1));
      break;
    case 'put':
      scriptPropertiesService.setProperty('statistics', JSON.stringify(result.gameEdited + 1));
  }
};
