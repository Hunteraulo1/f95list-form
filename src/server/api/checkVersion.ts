// let tempLogs = [];

import { getGames } from "./getGames";

const checkVersion = async () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jeux");

  let ids: string[] = [];
  const games = await getGames();
  const checkedGames: { index: number; id: string; version: string }[] = [];
  let result: { [key: string]: string } = {};

  games.forEach((game, index) => {
    const { domain, id, ac, version } = game;

    if (domain === "F95z" && id && ac) {
      ids.push(game.id);
      checkedGames.push({ index, id, version });
    }
  });

  for (let i = 0; i <= 0 /*ids.length / 100*/; i++) {
    let data = await f95Api(ids.splice(0, 100).toString());

    console.log({ data });

    if (data.status === "ok") {
      result = await Object.assign(result, data.msg);
    } else if (data.status === "error") {
      console.error(`${data.msg}`);
    } else {
      console.error(`${data.status}`);
    }
  }

  checkedGames.forEach((game) => {
    const { index, id, version } = game;
    if (version === result[id]) {
      // console.log(`ID: ${id} | version: ${version} / newVersion: ok`);
    } else if (result[id] === "Unknown") {
      console.log(`ID: ${id} | Unknown version`);
    } else if (result[id] !== undefined) {
      console.log(
        `ID: ${id} | version: ${version} > newVersion: ${result[id]}`
      );

      const row = sheet?.getRange(`A${index + 2}:M${index + 2}`).getValues()[0];

      if (row && row[0] == id) {
        sheet?.getRange(`D${index + 2}`).setValue(result[id]);
      } else {
        console.error({ row, id, version });
      }
    }
  });
};

const f95Api = (ids: string) => {
  let host = "https://f95zone.to";
  let url = `${host}/sam/checker.php?threads=${ids}`;
  let response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  let json = response.getContentText();
  return JSON.parse(json);
};
