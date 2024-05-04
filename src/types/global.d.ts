// Base Types
import type cheerio from "cheerio";

declare global {
  const Cheerio: typeof cheerio;
  const google: GoogleAppsScript.Base;
}
