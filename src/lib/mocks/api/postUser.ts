import { User } from '$types/schemas';

import type { UserType } from '$types/schemas';
import { dateNow } from '../../../server/lib/utils';

export const postUser = (email: string, overrides = {}): UserType => {
  console.info('postUser ~ args:', { email, overrides });

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!email) throw new Error('postUser ~ No email found');

  if (scriptPropertiesService.getProperty(email)) throw new Error('postUser ~ User already exists');

  const userDefaults: UserType = {
    email,
    role: 'user',
    preferences: {
      theme: 'dark',
    },
    profile: {
      pseudo: '',
      imageUrl: '',
    },
    activity: [
      {
        label: 'Utilisateur créé',
        value: dateNow(),
      },
    ],
    statistics: {
      gameAdded: 0,
      gameEdited: 0,
    },
  };

  const user = {
    ...userDefaults,
    ...overrides,
  };

  const validUser = User.parse(user);

  console.info('postUser ~ result:', validUser);

  return user;
};
