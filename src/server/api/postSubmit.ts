import { PostSubmit, type PostSubmitType, type SubmitType } from '$types/schemas';
import { checkUser } from '../lib/functions';
import { getSubmits } from './getSubmits';

export const postSubmit = async ({ query, game, type, comment }: PostSubmitType): Promise<void> => {
  // Report request
  console.info('postSubmit called with args:', { dataSubmit: { query, game, type, comment } });

  if (!checkUser('traductor')) throw new Error('Unauthorized');

  const validSubmit = PostSubmit.parse({ query, game, type, comment });

  if (!validSubmit) throw new Error('Invalid submit');

  const submits = await getSubmits({});
  if (!submits) throw new Error('Submits not found');

  if (submits.find((s) => s.query === validSubmit.query)) throw new Error('Submit already exists');

  try {
    const requestingUserEmail = Session.getActiveUser().getEmail();

    const submit: SubmitType = {
      email: requestingUserEmail,
      date: new Date().toISOString(),
      status: 'wait',
      reason: '',
      ...validSubmit,
    };

    const scriptPropertiesService = PropertiesService.getScriptProperties();
    const submits = JSON.parse(scriptPropertiesService.getProperty('submits') ?? '[]');

    submits.push(submit);

    scriptPropertiesService.setProperty('submits', JSON.stringify(submits));
  } catch (error) {
    console.error(error);

    throw new Error('Un problème est survenue lors de soumission du jeu');
  }
};
