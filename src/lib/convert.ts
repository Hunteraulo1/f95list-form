import type { SubmitType } from '$types/schemas';

type ConvertType<T extends string> = {
  [K in T]: string;
};

const types: ConvertType<SubmitType['type']> = {
  add: 'Ajouter',
  delete: 'Supprimer',
  edit: 'Modifier',
};

const status: ConvertType<SubmitType['status']> = {
  rejected: 'Rejeté',
  validated: 'Approuvé',
  wait: 'En attente',
};

export const getConvert = <T extends SubmitType['type'] | SubmitType['status']>(
  text: T,
  list: 'types' | 'status',
): string => {
  const dictionary = { types, status };

  return dictionary[list][text as keyof (typeof dictionary)[typeof list]] ?? text;
};
