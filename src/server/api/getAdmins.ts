import { User, type UserType } from '$types/schemas';

export const getAdmins = (): UserType[] => {
  console.info('getAdmins');

  const adminUsers = [];

  // Load all of the script properties as an object
  const scriptProperties = PropertiesService.getScriptProperties().getProperties();

  // Loop through script properties object
  for (const property in scriptProperties) {
    try {
      // Weed out properties that do not reprsent users
      const user = User.parse(JSON.parse(scriptProperties[property]));

      // If the user has an admin role, add them to our list
      if (user.role.includes('admin') || user.role.includes('superAdmin')) {
        adminUsers.push(user);
      }
    } catch (error) {
      console.error(error);
    }
  }

  console.info('adminUsers:', adminUsers);

  return adminUsers;
};
