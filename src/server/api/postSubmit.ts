import { PostSubmit, type PostSubmitType, type SubmitType } from '$types/schemas';
import { checkUser, dateNow } from '../lib/utils';
import { getSubmits } from './getSubmits';

export const postSubmit = async ({ query, game, type, comment }: PostSubmitType): Promise<string | undefined> => {
  console.info('postSubmit ~ args:', { dataSubmit: { query, game, type, comment } });

  if (!checkUser('traductor')) throw new Error('postSubmit ~ Unauthorized');

  const validSubmit = PostSubmit.parse({ query, game, type, comment });

  if (!validSubmit) throw new Error('postSubmit ~ Invalid submit');

  const submits = await getSubmits({});

  if (!submits) throw new Error('postSubmit ~ Submits not found');

  const requestingUserEmail = Session.getActiveUser().getEmail();

  const submit: SubmitType = {
    email: requestingUserEmail,
    date: dateNow(),
    status: 'wait',
    reason: '',
    ...validSubmit,
  };

  if (type === 'add') {
    submit.query = {
      name: game.name,
      version: game.version,
      id: game.id,
    };
  }

  if (!submit.query) throw new Error('postSubmit ~ Submit query not found');

  const submitFound = submits.find(
    (s) =>
      s.query?.id === submit.query?.id &&
      s.query?.name === submit.query?.name &&
      s.query?.version === submit.query?.version &&
      s.status === 'wait',
  );

  if (submitFound) return 'duplicate';

  try {
    const scriptPropertiesService = PropertiesService.getScriptProperties();
    const submits: SubmitType[] = JSON.parse(scriptPropertiesService.getProperty('submits') ?? '[]');

    submits.unshift(submit);

    scriptPropertiesService.setProperty('submits', JSON.stringify(submits));

    return;
  } catch (error) {
    console.error(error);

    throw new Error('postSubmit ~ Un problème est survenue lors de soumission du jeu');
  }
};
