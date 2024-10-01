import sleep from '$lib/sleep';
import type { TraductorType } from '$types/schemas';
import { traductors } from '../data/traductor';

export interface DelTraductorArgs {
  query: TraductorType['name'];
}

export const delTraductor = async ({ query }: DelTraductorArgs): Promise<void> => {
  await sleep();

  const traductor = traductors.find((traductor) => traductor.name === query);

  if (!traductor) throw new Error('delTraductor traductor not found');

  console.info('mockResponse_delTraductor', { query, traductors });
};
