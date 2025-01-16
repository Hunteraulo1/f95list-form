import { User } from '$types/schemas';
import { getUser } from './getUser';

import type { UserType } from '$types/schemas';
import { users as usersData } from '../data/user';
import { checkUser, dateNow } from '../utils';

export interface PutUserArgs {
  user: UserType;
  role?: UserType['role'];
}

export const putUser = async ({ user }: PutUserArgs): Promise<void> => {
  console.info('putUser ~ args:', { user });

  const activeUserEmail = user.email;
  const effectiveUserEmail = user.email;

  console.info('putUser ~ called by: ', activeUserEmail);

  const validUser = User.parse(user);

  if (!validUser.email) throw new Error('putUser ~ No email found');

  if (
    (validUser.role.includes('superAdmin') && (await getUser()).role !== 'superAdmin') ||
    activeUserEmail !== effectiveUserEmail
  )
    throw new Error('putUser ~ A user resource can only be updated by themselves or the superAdmin.');

  const properties: UserType | undefined = usersData.find((user) => user.email === validUser.email);

  if (!properties) throw new Error('putUser ~ No user found');

  properties.profile = validUser.profile;

  console.info('putUser ~ successfully saved.');
};

export const putUserRole = async ({ user, role }: PutUserArgs): Promise<boolean> => {
  console.info('putUserRole ~ args:', { user, role });

  if (!role) throw new Error('putUserRole ~ No role found');

  console.info('putUserRole ~ called by: ', user.email);

  const validUser = User.parse(user);

  if (!(await checkUser('admin'))) {
    console.warn('putUserRole ~ A user permission is required to update a user role.');

    return false;
  }

  if (!(await checkUser('superAdmin')) && ['admin', 'superAdmin'].includes(role)) {
    console.warn('putUserRole ~ Unauthorized: Only superAdmin can set admin roles');

    return false;
  }

  if (!validUser.email) throw new Error('putUserRole ~ No email found');

  const userScriptPropertiesUser = usersData.find((user) => user.email === validUser.email);

  if (!userScriptPropertiesUser) throw new Error('putUserRole ~ No user found');

  const properties: UserType = userScriptPropertiesUser;

  const newUser: UserType = {
    ...properties,
    role,
  };

  newUser.activity.unshift({
    value: dateNow(),
    label: 'Rôle changé',
  });

  const validNewUser = User.parse(newUser);

  console.info('putUserRole ~ result:', validNewUser);

  return true;
};

export const putStatistics = async (type: 'put' | 'post'): Promise<void> => {
  console.info('putStatistics ~ args:', { type });

  const validUser = User.parse(getUser());

  if (!validUser.email) throw new Error('putStatistics ~ No email found');

  const userScriptPropertiesService: UserType | undefined = usersData.find((user) => user.email === validUser.email);

  if (!userScriptPropertiesService) throw new Error('putStatistics ~ No user found');

  const result: UserType['statistics'] = userScriptPropertiesService.statistics;

  if (!result) throw new Error('putStatistics ~ No statistics found');

  switch (type) {
    case 'post':
      console.info('putStatistics ~ post');
      break;
    case 'put':
      console.info('putStatistics ~ put');
      break;
  }
};

export interface DelActivityArgs {
  email: UserType['email'];
}

export const delActivity = async ({ email }: DelActivityArgs): Promise<void> => {
  console.info('putStatistics ~ args:', { email });

  if (!email) throw new Error('email args empty');

  const user: UserType | undefined = usersData.find((u) => u.email === email);

  if (!user || !user.email) throw new Error('user not found');

  user.activity = [];

  console.info('delActivity finished');
};
