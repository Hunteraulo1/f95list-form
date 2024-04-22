import { TraductorType } from "$types/schemas";
import { traductors } from "../data/game";
import sleep from "../sleep";

export const getTraductors = async (): Promise<TraductorType[]> => {
  await sleep();

  return JSON.parse(JSON.stringify(traductors));
};
