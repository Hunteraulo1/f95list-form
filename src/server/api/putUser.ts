import { User, type UserType } from "$types/schemas";

export type PutUserArgs = {
  user: UserType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = ({ user }: PutUserArgs): Promise<UserType> => {
  const invokingUserEmail = Session.getActiveUser().getEmail();

  console.info("putUser() called with: ", user, "by: ", invokingUserEmail);

  user.activity.push({
    value: new Date().toISOString(),
    label: "Utilisateur mis à jour",
  });

  const validUser = User.parse(user);

  // if (
  //   validUser.email === invokingUserEmail &&
  //   validUser.email === Session.getEffectiveUser().getEmail()
  // ) throw new Error("A user resource can only be updated by themselves or the superAdmin.")

  // If the code reaches here, the user object is valid
  // and the invoking user is either the user or a superAdmin.
  const propertyKey = validUser.email;
  const scriptPropertiesService = PropertiesService.getScriptProperties();
  scriptPropertiesService.setProperty(propertyKey, JSON.stringify(validUser));

  console.info("User successfully saved.");

  return validUser;
};
