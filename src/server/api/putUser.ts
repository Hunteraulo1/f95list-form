import { User, type UserType } from "$types/schemas";

export type PutUserArgs = {
  user: UserType;
};

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = ({ user }: PutUserArgs) => {
  const invokingUserEmail = Session.getActiveUser().getEmail();

  console.info("putUser() called with: ", user, "by: ", invokingUserEmail);

  const validUser = User.parse(user);

  if (validUser.roles.includes("superAdmin") && invokingUserEmail !== Session.getEffectiveUser().getEmail())
    throw new Error("A user resource can only be updated by themselves or the superAdmin.");

  // If the code reaches here, the user object is valid
  // and the invoking user is either the user or a superAdmin.
  const scriptPropertiesService = PropertiesService.getScriptProperties();

  if (!validUser.email) {
    return;
  }

  const properties: UserType = JSON.parse(scriptPropertiesService.getProperty(validUser.email) ?? "");

  if (JSON.stringify(properties.activity) != JSON.stringify(validUser.activity))
    throw new Error("Not actual data user");

  if (JSON.stringify(user.statistics) === JSON.stringify(properties.statistics)) {
    user.activity.push({
      value: new Date().toISOString(),
      label: "Utilisateur mis à jour",
    });
  }

  scriptPropertiesService.setProperty(validUser.email ?? "", JSON.stringify(validUser));

  console.info("User successfully saved.");
};
