import { users } from "../data/user";

import { User, type UserType } from "$types/schemas";

export const getAdmins = (): UserType[] => {
  // Return variable
  const adminUsers = [];

  // Loop through script properties object
  for (const user of users) {
    try {
      // Weed out properties that do not reprsent users
      const validUser = User.parse(user);

      // If the user has an admin role, add them to our list
      if (validUser.roles.includes("admin")) {
        adminUsers.push(validUser);
      }
    } catch (error) {
      // Not a user, carry on
      console.error(error);
    }
  }

  return adminUsers;
};
