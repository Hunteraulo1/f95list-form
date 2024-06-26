// GoogleAppScript

import { initializeApp } from './lib/initializeApp'
import { loadAppConfiguration } from './lib/loadAppConfiguration'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const doGet = (e: unknown) => {
  // We shouldn't load the application if we aren't able to get the user's
  // identity. In this case, we return the noAuth.html page.
  const activeUserEmail = Session.getActiveUser().getEmail()

  if (activeUserEmail === '') {
    return HtmlService.createTemplateFromFile('server/noAuth')
      .evaluate()
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
  }

  // Otherwise, we check to see if this application has been initialized.
  // If not, we do so now
  const appConfig = loadAppConfiguration()
  if (!appConfig) initializeApp()

  // At this point we should

  return HtmlService.createHtmlOutputFromFile('client/index.html').setXFrameOptionsMode(
    HtmlService.XFrameOptionsMode.ALLOWALL,
  )
}
