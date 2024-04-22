import type { UserType } from "$types/schemas";
import * as z from "zod";
import { createUser } from "../lib/createUser";

export type GetUserArgs = {
  email: string | null;
};

/**
 * **API Endpoint** | Returns the accessing user object
 */
export const getUser = ({ email }: GetUserArgs = { email: null }): UserType => {
  const requestingUserEmail = Session.getActiveUser().getEmail();
  // Report request
  console.info(
    "getUser called with args:",
    { email },
    " | by: ",
    requestingUserEmail
  );

  // Validate the arguments against the schema
  const GetUserArgsSchema = z.object({
    email: z.string().email().nullable().optional(),
  });
  const validArgs = GetUserArgsSchema.parse({ email });

  const EMAIL_FOR_RETRIEVAL = validArgs.email || requestingUserEmail;
  console.log({ EMAIL_FOR_RETRIEVAL });

  const isRequestForSelf = requestingUserEmail === EMAIL_FOR_RETRIEVAL;

  const scriptPropertiesService = PropertiesService.getScriptProperties();
  const scriptProperties = scriptPropertiesService.getProperties();
  const userObjectString = scriptProperties[EMAIL_FOR_RETRIEVAL];

  // If the requested user's object doesnt exist and the request is from
  // someone other than the requested user, return null.
  if (!userObjectString && !isRequestForSelf) {
    throw new Error("User not found");
  }

  // Else if the the request user's object doesn't exist but it is a request
  // from the requested user, create the user object and return it. They
  // now exist in the system.
  if (!userObjectString || !isRequestForSelf)
    return createUser(EMAIL_FOR_RETRIEVAL);

  console.log(userObjectString);

  // Otherwise, the user object exists and we can return it.
  return JSON.parse(userObjectString) as UserType;
};
