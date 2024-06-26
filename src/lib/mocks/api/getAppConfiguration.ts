import { appConfiguration } from '../data/appConfiguration'
import sleep from '../sleep'

import { getAdmins } from './getAdmins'

import { type AppConfigurationType } from '$types/schemas'

export const getAppConfiguration = async (): Promise<AppConfigurationType> => {
  await sleep()

  const appConfig = {
    ...appConfiguration,
    admins: getAdmins(),
  }

  const mockResponse = appConfig

  console.info('mockResponse', mockResponse)

  return JSON.parse(JSON.stringify(mockResponse))
}
