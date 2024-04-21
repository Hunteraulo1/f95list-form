import { GameType } from "$types/schemas";
import { getFetchF95z } from "./getFetchF95z";

export type GetScrapeArgs = {
  domain: Exclude<GameType["domain"], "Autre">;
  id: string;
};

export const getScrape = async ({
  domain,
  id,
}: GetScrapeArgs): Promise<GameType> => {
  // Report request
  console.info("getScrape called with args: " + { domain, id });

  if (domain !== "F95z") throw new Error("domaine incompatible");

  let link = `https://f95zone.to/threads/${id}`;
  let regName = /.*-\s(.*?)\s\[/i;
  let regTitle = /([\w\\']+)(?=\s-)/gi;

  // case "LewdCorner":
  //   link = `https://lewdcorner.com/threads/${id}`;
  //   regName = /-\s([\w\d].*?)\s\[/i;
  //   regTitle = /(?!\[)([\w\\']+)(?=\]\s-)/gi;
  //   break;

  const response = UrlFetchApp.fetch(link, {
    muteHttpExceptions: true,
  });
  const $ = Cheerio.load(response.getContentText());
  const tags = $(".tagItem")
    .map((_, tag) => $(tag).text().trim())
    .get();
  let title = $("title").text();
  console.log("🚀 ~ getScrape ~ title:", title);

  const titleMatch = title.match(regName) ?? [];

  const name = titleMatch?.[1] ?? "";
  const { status, type } = scrapeGetTitle(titleMatch);

  console.log("🚀 ~ getScrape ~ regName:", title.match(regName));

  let version = "";

  try {
    const result = await getFetchF95z(id);

    console.log({ result });

    version = result || "";
  } catch (error) {
    console.error("Error getFetchF95z: ", error);
    throw new Error("getFetchF95z no return");
  }

  console.log("scrapePage", { name, version, status, tags, type, domain });
  return { name, version, status, tags, type };
};

const scrapeGetTitle = (data: string[]) => {
  let status = "";
  let type = "";

  data.forEach((e: string) => {
    switch (e) {
      case "Abandoned":
        status = "ABANDONNÉ";
        break;
      case "Completed":
        status = "TERMINÉ";
        break;
      default:
        status = "EN COURS";
        break;
    }
    switch (e) {
      case "Ren'Py":
        type = "RenPy";
        break;
      case "RPGM":
        type = "RPGM";
        break;
      case "Unity":
        type = "Unity";
        break;
      case "Unreal":
        type = "Unreal";
        break;
      case "Flash":
        type = "Flash";
        break;
      case "HTML":
        type = "HTML";
        break;
      case "QSP":
        type = "QSP";
        break;
      case "Other":
        type = "Autre";
        break;
    }
  });

  return { status, type };
};
