import sleep from "../sleep"

import { AppConfiguration, AppConfigurationType } from "$types/schemas"

interface PutAppConfigArgs {
  appConfiguration: AppConfigurationType
}

export const putAppConfiguration = async ({ appConfiguration }: PutAppConfigArgs): Promise<AppConfigurationType> => {
  await sleep()

  const mockResponse: AppConfigurationType = AppConfiguration.parse(appConfiguration)

  return JSON.parse(JSON.stringify(mockResponse)) as AppConfigurationType
}
