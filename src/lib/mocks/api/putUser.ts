import sleep from '../sleep'

import { User, UserType } from '$types/schemas'

interface PutUserArgs {
  user: UserType
}

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = async ({ user }: PutUserArgs): Promise<void> => {
  await sleep()

  User.parse(user)

  console.info('putUser() called with: ', user)
}

export const putUserRole = async ({ user }: PutUserArgs): Promise<void> => {
  await sleep()

  User.parse(user)

  console.info('putUserRole() called with: ', user)
}
