import { User, type UserType } from "$types/schemas"

export const getAdmins = (): UserType[] => {
  // Return variable
  const adminUsers = []

  // Load all of the script properties as an object
  const scriptProperties = PropertiesService.getScriptProperties().getProperties()

  // Loop through script properties object
  for (const property in scriptProperties) {
    try {
      // Weed out properties that do not reprsent users
      const user = User.parse(JSON.parse(scriptProperties[property]))

      // If the user has an admin role, add them to our list
      if (user.roles.includes("admin") || user.roles.includes("superAdmin")) {
        adminUsers.push(user)
      }
    } catch (error) {
      // Not a user, carry on
    }
  }

  return adminUsers
}
