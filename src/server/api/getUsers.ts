import type { UserType } from '$types/schemas'

/**
 * **API Endpoint** | Returns the accessing user object
 */
export const getUsers = (): UserType[] => {
  const requestingUserEmail = Session.getActiveUser().getEmail()
  // Report request
  console.info('getUsers called by: ', requestingUserEmail)

  const scriptPropertiesService = PropertiesService.getScriptProperties()
  const scriptProperties = scriptPropertiesService.getProperties()

  const users: UserType[] = []

  // Check if scriptProperties is an array or iterable object
  Object.entries(scriptProperties).forEach(([key, value]) => {
    if (!key.includes('@')) return

    users.push(JSON.parse(value))
  })

  // Otherwise, the user object exists and we can return it.
  return users
}
