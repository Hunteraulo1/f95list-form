import * as cheerio from "cheerio";
import { type ScrapeGameType } from "../../types/schemas";

export type GetScrapeArgs = {
  domain: "F95z" | "LewdCorner";
  id: string;
};

/**
 * **API Endpoint** | Returns the accessing game object
 * @param {GetScrapeArgs} - Required parameter containing game id.
 * @returns {Promise<ScrapeGameType | null>}
 */
export async function getScrape({
  domain,
  id,
}: GetScrapeArgs): Promise<ScrapeGameType | null | any> {
  // Report request
  console.info("getScrape called");

  const link = `https://${
    domain === "F95z" ? "f95zone.to" : "lewdcorner.com"
  }/threads/${id}`;

  const response = UrlFetchApp.fetch(link);
  const scrape = cheerio.load(response.getContentText());

  const result = scrape("title");
  // ScrapeGame.parse(result)
  return result || null;
}
