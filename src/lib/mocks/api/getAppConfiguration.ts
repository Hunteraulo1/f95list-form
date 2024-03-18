import { AppConfigurationType, User, UserType } from "../../../types/schemas";
import { appConfiguration } from "../data/appConfiguration";
import { users } from "../data/user";
import sleep from "../sleep";

export async function getAppConfiguration(): Promise<AppConfigurationType> {
  sleep();

  const appConfig = {
    ...appConfiguration,
    admins: getAdmins_(),
  };

  const mockResponse = appConfig;

  console.log("mockResponse", mockResponse);

  return JSON.parse(JSON.stringify(mockResponse));

  function getAdmins_(): UserType[] {
    // Return variable
    const adminUsers = [];

    // Loop through script properties object
    for (let a = 0; a < users.length; a++) {
      try {
        // Weed out properties that do not reprsent users
        const user = User.parse(users[a]);

        // If the user has an admin role, add them to our list
        if (user.roles.includes("admin")) {
          adminUsers.push(user);
        }
      } catch (error) {
        // Not a user, carry on
        console.error(error);
      }
    }

    return adminUsers;
  }
}
