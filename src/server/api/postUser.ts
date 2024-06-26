import { User, type UserType } from '$types/schemas';

export const postUser = (email: string, overrides = {}): UserType => {
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!email) throw new Error('No email found');

  if (scriptPropertiesService.getProperty(email)) throw new Error('User already exists');

  const userDefaults: UserType = {
    email,
    roles: [],
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
        value: new Date().toISOString(),
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

  return user;
};
