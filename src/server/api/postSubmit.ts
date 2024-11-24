import { PostSubmit, type PostSubmitType, type SubmitType } from '$types/schemas';
import { checkUser, dateNow } from '../lib/utils';
import { getSubmits } from './getSubmits';

export const postSubmit = async ({ query, game, type, comment }: PostSubmitType): Promise<string | null> => {
  // Report request
  console.info('postSubmit called with args:', { dataSubmit: { query, game, type, comment } });

  if (!checkUser('traductor')) throw new Error('Unauthorized');

  const validSubmit = PostSubmit.parse({ query, game, type, comment });

  if (!validSubmit) throw new Error('Invalid submit');

  const submits = await getSubmits({});
  if (!submits) throw new Error('Submits not found');

  if (
    submits.find(
      (s) => s.query?.id === query?.id && s.query?.name === query?.name && s.query?.version === query?.version,
    )
  )
    return 'duplicate';

  try {
    const requestingUserEmail = Session.getActiveUser().getEmail();

    const submit: SubmitType = {
      email: requestingUserEmail,
      date: dateNow(),
      status: 'wait',
      reason: '',
      ...validSubmit,
    };

    const scriptPropertiesService = PropertiesService.getScriptProperties();
    const submits = JSON.parse(scriptPropertiesService.getProperty('submits') ?? '[]');

    submits.push(submit);

    scriptPropertiesService.setProperty('submits', JSON.stringify(submits));

    return null;
  } catch (error) {
    console.error(error);

    throw new Error('Un problème est survenue lors de soumission du jeu');
  }
};
