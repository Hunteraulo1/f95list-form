import { User, type UserType } from '$types/schemas';
import { dateNow } from '../lib/utils';

export const postUser = (email: string, overrides = {}): UserType => {
  console.info('postUser ~ args:', { email, overrides });

  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!email) throw new Error('No email found');

  if (scriptPropertiesService.getProperty(email)) throw new Error('User already exists');

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
  scriptPropertiesService.setProperty(email, JSON.stringify(validUser));

  console.info('postUser ~ result:', user);

  return user;
};
