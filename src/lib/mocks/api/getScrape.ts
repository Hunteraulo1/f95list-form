import { ScrapeGameType } from "../../../types/schemas";
import { scrape } from "../data/game";
import sleep from "../sleep";

export type GetScrapeArgs = {
  domain: "F95z" | "LewdCorner";
  id: string;
};

/**
 * @param {GetScrapeArgs} [optionalArgs] - Required parameter containing platform and id of game
 * @returns {Promise<ScrapeGameType>}
 */
export async function getScrape({
  domain,
  id,
}: GetScrapeArgs): Promise<ScrapeGameType> {
  await sleep();

  let mockResponse = await scrape(domain, id);

  if (!mockResponse) {
    mockResponse = {
      name: "",
      status: "",
      tags: "",
      type: "",
      version: "",
    };
  }

  // Fonctionne pas en local
  // if (domain === "F95z") {
  //   const fetchId = await getFetchF95z(id);

  //   if (fetchId && mockResponse?.version) {
  //     mockResponse.version = fetchId;
  //   }
  // }

  return JSON.parse(JSON.stringify(mockResponse));
}
