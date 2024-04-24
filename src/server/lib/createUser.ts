import { User, type UserType } from "$types/schemas";

export const createUser = (email: string, overrides = {}) => {
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  const userDefaults: UserType = {
    email,
    roles: [],
    preferences: {
      theme: "dark",
    },
    profile: {
      pseudo: "",
      imageUrl: "https://lh3.googleusercontent.com/a-/AOh14Gj-cdUSUVoEge7rD5a063tQkyTDT3mripEuDZ0v=s100",
    },
    activity: [
      {
        label: "Utilisateur créé",
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
