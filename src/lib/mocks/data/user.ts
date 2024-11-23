import type { UserType } from '$types/schemas';

export const user: UserType = {
  email: 'mock_mockerson@test.com',
  roles: ['superAdmin'],
  profile: {
    pseudo: 'Mock',
    imageUrl: 'https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100',
  },
  preferences: {
    theme: 'dark',
  },
  activity: [
    { label: 'User Created', value: '2021-01-01T00:00:00.000Z' },
    { label: 'User Updated', value: '2021-01-01T00:00:00.000Z' },
  ],
  statistics: {
    gameAdded: 84,
    gameEdited: 518,
  },
};

export const users: UserType[] = [
  user,
  {
    email: 'johndoe@test.com',
    roles: ['admin'],
    profile: {
      pseudo: 'John',
      imageUrl: 'https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100',
    },
    preferences: {
      theme: 'light',
    },
    activity: [
      { label: 'User Created', value: '2023-01-01T00:00:00.000Z' },
      { label: 'User Updated', value: '2023-03-12T00:00:00.000Z' },
    ],
    statistics: {
      gameAdded: 25,
      gameEdited: 263,
    },
  },
  {
    email: 'janedoe@test.com',
    roles: [],
    profile: {
      pseudo: 'Jane',
      imageUrl: 'https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100',
    },
    preferences: {
      theme: 'light',
    },
    activity: [
      { label: 'User Created', value: '2023-01-01T00:00:00.000Z' },
      { label: 'User Updated', value: '2023-03-12T00:00:00.000Z' },
    ],
    statistics: {
      gameAdded: 18,
      gameEdited: 372,
    },
  },
];
