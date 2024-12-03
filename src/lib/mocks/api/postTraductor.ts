import { Traductor } from '$types/schemas';
import { disableLock, enableLock } from '../lockMode';
import { checkUser } from '../utils';
import { getTraductors } from './getTraductors';

import type { TraductorType } from '$types/schemas';

export interface PostTraductorArgs {
  traductor: TraductorType;
}

export const postTraductor = async ({ traductor }: PostTraductorArgs): Promise<undefined | string> => {
  console.info('postTraductor ~ args:', { dataTraductor: traductor });

  if (!(await checkUser('admin'))) throw new Error('postTraductor ~ Unauthorized');

  try {
    enableLock();

    const validTraductor = Traductor.parse(traductor);
    const traductors = await getTraductors();

    const duplicate = traductors?.findIndex(
      (traductor) => traductor.name.toLowerCase() === validTraductor.name.toLowerCase(),
    );

    if (duplicate !== -1) return 'duplicate';
  } catch (error) {
    console.error(error);

    throw new Error("postTraductor ~ Un problème est survenue lors de l'ajout du traducteur");
  } finally {
    disableLock();
  }
};
