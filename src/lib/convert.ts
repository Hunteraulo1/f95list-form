import type { SubmitType } from '$types/schemas';

type ConvertType<T extends string> = {
  [K in T]: string;
};

export const types: ConvertType<SubmitType['type']> = {
  add: 'Ajouter',
  delete: 'Supprimer',
  edit: 'Modifier',
};

export const status: ConvertType<SubmitType['status']> = {
  rejected: 'Rejeté',
  validated: 'Approuvé',
  wait: 'En attente',
};

export const getConvert = <T extends SubmitType['type'] | SubmitType['status']>(text: T, list: 'types' | 'status') => {
  if (list === 'types') {
    return types[text as SubmitType['type']] ?? text;
  }

  return status[text as SubmitType['status']] ?? text;
};
