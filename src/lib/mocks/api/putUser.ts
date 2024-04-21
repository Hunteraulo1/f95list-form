import { User, UserType } from "$types/schemas";
import sleep from "../sleep";

interface PutUserArgs {
  user: UserType;
}

/**
 * **API Endpoint** | Updates the app configuration and returns it
 */
export const putUser = async ({ user }: PutUserArgs): Promise<UserType> => {
  await sleep();

  const mockResponse = User.parse(user);

  return JSON.parse(JSON.stringify(mockResponse));
};
