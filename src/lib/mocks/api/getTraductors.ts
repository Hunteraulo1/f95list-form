import { traductors } from '../data/traductor';
import sleep from '../sleep';

import { TraductorType } from '$types/schemas';

export const getTraductors = async (): Promise<TraductorType[]> => {
  await sleep();

  return JSON.parse(JSON.stringify(traductors));
};
