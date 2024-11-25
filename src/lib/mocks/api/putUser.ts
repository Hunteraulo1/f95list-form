import { User } from '$types/schemas';
import { getUser } from './getUser';

import type { UserType } from '$types/schemas';
import { checkUser, dateNow } from '../../../server/lib/utils';
import { users as usersData } from '../data/user';

export interface PutUserArgs {
  user: UserType;
  role?: UserType['role'];
}

export const putUser = ({ user }: PutUserArgs): void => {
  console.info('putUser ~ args:', { user });

  const activeUserEmail = Session.getActiveUser().getEmail();
  const effectiveUserEmail = Session.getEffectiveUser().getEmail();

  console.info('putUser ~ called by: ', activeUserEmail);

  const validUser = User.parse(user);

  if (!validUser.email) throw new Error('putUser ~ No email found');

  if (validUser.role.includes('superAdmin') && activeUserEmail !== effectiveUserEmail)
    throw new Error('putUser ~ A user resource can only be updated by themselves or the superAdmin.');

  const properties: UserType | undefined = usersData.find((user) => user.email === validUser.email);

  if (!properties) throw new Error('putUser ~ No user found');

  properties.profile = validUser.profile;

  if (JSON.stringify(validUser.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: dateNow(),
      label: 'Utilisateur mis à jour',
    });
  }

  console.info('putUser ~ successfully saved.');
};

export const putUserRole = ({ user, role }: PutUserArgs): void => {
  console.info('putUserRole ~ args:', { user, role });

  if (!role) throw new Error('putUserRole ~ No role found');

  console.info('putUserRole ~ called by: ', Session.getActiveUser().getEmail());

  const validUser = User.parse(user);

  if (!validUser) throw new Error('putUserRole ~ Invalid user');
  if (!checkUser('admin')) throw new Error('putUserRole ~ A user permission is required to update a user role.');

  if (checkUser('admin') && ['admin', 'superAdmin'].includes(role))
    throw new Error('putUserRole ~ A user resource can only be updated by superAdmin.');

  if (!validUser.email) throw new Error('putUserRole ~ No email found');

  const userScriptPropertiesUser = usersData.find((user) => user.email === validUser.email);

  if (!userScriptPropertiesUser) throw new Error('putUserRole ~ No user found');

  const properties: UserType = userScriptPropertiesUser;

  properties.role = validUser.role;

  if (JSON.stringify(validUser.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: dateNow(),
      label: 'Utilisateur mis à jour',
    });
  }

  console.info('putUserRole ~ successfully saved.');
};

export const putStatistics = (type: 'put' | 'post'): void => {
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
