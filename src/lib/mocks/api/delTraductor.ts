import type { TraductorType } from '$types/schemas';
import { traductors } from '../data/traductor';
import sleep from '../sleep';

export interface DelTraductorArgs {
  query: TraductorType['name'];
}

export const delTraductor = async ({ query }: DelTraductorArgs): Promise<void> => {
  await sleep();

  const { name, version } = query;

  const traductor = traductors.find((traductor) => traductor.name === name);

  if (!traductor) throw new Error('delTraductor traductor not found');

  console.info('mockResponse_delTraductor', { query, traductors });
};
