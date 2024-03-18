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
}: GetScrapeArgs): Promise<ScrapeGameType | null> {
  await sleep();

  let mockResponse = scrape(domain, id);
  console.log({ mockResponse });
  return JSON.parse(JSON.stringify(mockResponse));
}
