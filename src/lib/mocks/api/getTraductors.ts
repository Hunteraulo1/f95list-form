import { Traductor } from '$types/schemas';
import { traductors as traductorData } from '../data/traductor';

import type { TraductorType } from '$types/schemas';

export const getTraductors = async (): Promise<TraductorType[]> => {
  console.info('getTraductors');

  const result = traductorData.map((traductor) => Traductor.parse(traductor));

  console.info('getTraductors ~ result:', result);

  return result;
};
