// GoogleAppScript

import { initializeApp } from './lib/initializeApp';
import { loadAppConfiguration } from './lib/loadAppConfiguration';
import { isMaintenance } from './lib/mainteanceMode';

const doGet = (_e: unknown): GoogleAppsScript.HTML.HtmlOutput => {
  const activeUserEmail = Session.getActiveUser().getEmail();

  console.info('doGet ~ activeUserEmail', activeUserEmail);

  isMaintenance();

  if (activeUserEmail === '') {
    return HtmlService.createTemplateFromFile('server/noAuth')
      .evaluate()
      .setTitle('Gestion des traductions')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  const appConfig = loadAppConfiguration();
  if (!appConfig) initializeApp();

  return HtmlService.createHtmlOutputFromFile('client/index.html')
    .setTitle('Gestion des traductions')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
};
