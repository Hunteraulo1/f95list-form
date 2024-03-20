import { TraductorType } from "../../../types/schemas";
import { traductors } from "../data/game";
import sleep from "../sleep";

/**
 * @returns {Promise<TraductorType[]>}
 */
export async function getTraductors(): Promise<TraductorType[] | null> {
  await sleep();

  return JSON.parse(JSON.stringify(traductors));
}
