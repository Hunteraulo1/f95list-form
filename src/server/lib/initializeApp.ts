import { ENV } from "../env"

import { createUser } from "./createUser"
import { loadAppConfiguration } from "./loadAppConfiguration"

import type { AppConfigurationType } from "$types/schemas"

export const initializeApp = (): AppConfigurationType | string => {
  let superAdminEmail: string = ""

  switch (ENV.executeAs) {
    case "USER_DEPLOYING":
      superAdminEmail = Session.getEffectiveUser().getEmail()
      break
    case "USER_ACCESSING":
      superAdminEmail = DriveApp.getFileById(ScriptApp.getScriptId()).getOwner().getEmail()
      break
    default:
      return "L'application n'a pas pu être initialisée"
  }

  const deployingUserEmail = Session.getEffectiveUser().getEmail()

  createUser(superAdminEmail, { roles: ["superAdmin"] })

  const newAppConfig: AppConfigurationType = {
    appName: "My App",
    deployingUserEmail,
    admins: [],
  }

  const scriptPropertiesService = PropertiesService.getScriptProperties()
  scriptPropertiesService.setProperty("appConfiguration", JSON.stringify(newAppConfig))

  const appConfig = loadAppConfiguration()

  return JSON.parse(JSON.stringify(appConfig)) as AppConfigurationType
}
