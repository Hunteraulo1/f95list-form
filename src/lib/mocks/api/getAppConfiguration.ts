import { appConfiguration } from "../data/appConfiguration";
import sleep from "../sleep";

import { type AppConfigurationType } from "$types/schemas";
import { getAdmins } from "./getAdmins";

export const getAppConfiguration = async (): Promise<AppConfigurationType> => {
  await sleep();

  const appConfig = {
    ...appConfiguration,
    admins: getAdmins(),
  };

  const mockResponse = appConfig;

  console.info("mockResponse", mockResponse);

  return JSON.parse(JSON.stringify(mockResponse));
};
