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

  if (
    (validUser.role.includes('superAdmin') && (await getUser()).role !== 'superAdmin') ||
    activeUserEmail !== effectiveUserEmail
  )
    throw new Error('putUser ~ A user resource can only be updated by themselves or the superAdmin.');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  const properties: UserType = JSON.parse(scriptPropertiesService.getProperty(validUser.email) ?? '');

  const { preferences, profile } = validUser;
  const newUser: UserType = {
    ...properties,
    preferences,
    profile,
  };

  const validNewUser = User.parse(newUser);

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validNewUser));

  console.info('putUser ~ successfully saved.');
};

export const putUserRole = async ({ user, role }: PutUserArgs): Promise<boolean> => {
  console.info('putUserRole ~ args:', { user, role });

  if (!role) throw new Error('putUserRole ~ No role found');

  console.info('putUserRole ~ called by: ', Session.getActiveUser().getEmail());

  const validUser = User.parse(user);

  if (!(await checkUser('admin'))) {
    console.warn('putUserRole ~ A user permission is required to update a user role.');

    return false;
  }

  if (!(await checkUser('superAdmin')) && ['admin', 'superAdmin'].includes(role)) {
    console.warn('putUserRole ~ Unauthorized: Only superAdmin can set admin roles');

    return false;
  }

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!validUser.email) throw new Error('putUserRole ~ No email found');

  const userScriptPropertiesUser = scriptPropertiesService.getProperty(validUser.email);

  if (!userScriptPropertiesUser) throw new Error('putUserRole ~ No user found');

  const properties: UserType = JSON.parse(userScriptPropertiesUser);

  const newUser: UserType = {
    ...properties,
    role,
  };

  newUser.activity.unshift({
    value: dateNow(),
    label: 'Rôle changé',
  });

  const validNewUser = User.parse(newUser);

  scriptPropertiesService.setProperty(validUser.email, JSON.stringify(validNewUser));

  console.info('putUserRole ~ successfully saved.');

  return true;
};

export const putStatistics = async (type: 'put' | 'post'): Promise<void> => {
  console.info('putStatistics ~ args:', { type });

  const user = await getUser();

  if (!user) throw new Error('not user found');

  if (!user.email) throw new Error('putStatistics ~ No email found');

  switch (type) {
    case 'post':
      user.statistics.gameAdded++;
      break;
    case 'put':
      user.statistics.gameEdited++;
      break;
  }

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  scriptPropertiesService.setProperty(user.email, JSON.stringify(user));
};

export interface DelActivityArgs {
  email: UserType['email'];
}

export const delActivity = async ({ email }: DelActivityArgs): Promise<void> => {
  console.info('putStatistics ~ args:', { email });

  if (!email) throw new Error('email args empty');

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  const user: UserType = JSON.parse(scriptPropertiesService.getProperty(email) ?? '');

  if (!user.email) throw new Error('user not found');

  user.activity = [];

  scriptPropertiesService.setProperty(email, JSON.stringify(user));
};
