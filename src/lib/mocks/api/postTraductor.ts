import sleep from '../sleep';

import { Traductor, type TraductorType } from '$types/schemas';
import { traductors } from '../data/traductor';

export interface PostTraductorArgs {
  traductor: TraductorType;
}

export const postGame = async ({ traductor }: PostTraductorArgs): Promise<void | string> => {
  await sleep();

  const validTraductor = Traductor.parse(traductor);

  traductors.push(validTraductor);

  console.info('mockResponse_postGame', { validGame: validTraductor, traductors });
};
