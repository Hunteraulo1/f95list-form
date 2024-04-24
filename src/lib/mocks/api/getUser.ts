import { user, users } from "../data/user"
import sleep from "../sleep"

import { UserType } from "$types/schemas"

interface GetUserArgs {
  email: UserType["email"] | null
}

export const getUser = async ({ email }: GetUserArgs = { email: null }): Promise<UserType | null> => {
  await sleep()

  let mockResponse = null

  console.info({ email })

  if (!email) {
    mockResponse = user
  } else {
    const user = users.find((user) => user.email === email)
    if (user) {
      mockResponse = user
    }
  }

  console.info("mockResponse", mockResponse)

  return JSON.parse(JSON.stringify(mockResponse))
}
