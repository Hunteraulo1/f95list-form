// let tempLogs = [];

import { getGames } from "../api/getGames";
import { getScrape } from "../api/getScrape";

import { sendWebhookAC } from "./webhook";

import type { GameACType } from "$types/schemas";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const checkVersion = async () => {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Jeux");

  const ids: string[] = [];
  const games = await getGames();
  const checkedGames: { index: number; id: string; version: string }[] = [];
  let result: { [key: string]: string } = {};
  const changed: GameACType[] = [];

  games.forEach((game, index) => {
    const { domain, id, ac, version } = game;

    if (domain === "F95z" && id && ac) {
      ids.push(game.id);
      checkedGames.push({ index, id, version });
    }
  });

  for (let index = 0; index <= ids.length / 100; index++) {
    const data = await f95Api(ids.splice(0, 100).toString());

    console.info({ data });

    if (data.status === "ok") {
      result = await Object.assign(result, data.msg);
    } else if (data.status === "error") {
      console.error(`${data.msg}`);
    } else {
      console.error(`${data.status}`);
    }
  }

  checkedGames.forEach(async (game) => {
    const { index, id, version } = game;
    if (version === result[id]) {
      // console.info(`ID: ${id} | version: ${version} / newVersion: ok`);
    } else if (result[id] === "Unknown") {
      console.info(`ID: ${id} | Unknown version`);
    } else if (result[id] !== undefined) {
      console.info(`ID: ${id} | version: ${version} > newVersion: ${result[id]}`);

      const row = sheet?.getRange(`A${index + 2}:M${index + 2}`).getValues()[0];

      if (row && row[0] == id) {
        sheet?.getRange(`D${index + 2}`).setValue(result[id]);

        changed.push({ id, version, newVersion: result[id] });

        try {
          const result = await getScrape({ domain: "F95z", id });

          console.log(`${id}: ${result?.image}`);

          if (result?.image === "") return;

          sheet?.getRange(`N${index + 2}`).setValue(result.image);
        } catch (error) {
          console.error("scrape image error: ", error);
        }
      } else {
        console.error({ row, id, version });
      }
    }
  });

  sendWebhookAC({ games: changed });
};

const f95Api = (ids: string | string[]) => {
  interface Response {
    status: "ok";
    msg: {
      [key: string]: string;
    };
  }

  const host = "https://f95zone.to";
  const url = `${host}/sam/checker.php?threads=${ids}`;
  const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });

  const json = response.getContentText();

  return JSON.parse(json) as Response;
};
