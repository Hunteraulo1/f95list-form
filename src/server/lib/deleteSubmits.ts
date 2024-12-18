import { getSubmits } from '../api/getSubmits';

import type { SubmitType } from '$types/schemas';

const deleteSubmits = async (): Promise<void> => {
  console.info('deleteSubmits');

  const submits = await getSubmits({});
  const newSubmits: SubmitType[] = [];

  if (!submits) throw new Error('postSubmit ~ Submits not found');
  const dateNow = Date.now();

  for (const s of submits) {
    if ((s.status === 'rejected' || s.status === 'validated') && new Date(s.date).getDate() + 7 >= dateNow) continue;

    newSubmits.push(s);
  }

  try {
    const scriptPropertiesService = PropertiesService.getScriptProperties();

    scriptPropertiesService.setProperty('submits', JSON.stringify(newSubmits));
  } catch (error) {
    console.error(error);

    throw new Error('postSubmit ~ Un problème est survenue lors de soumission du jeu');
  }
};
