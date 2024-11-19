import { PostSubmit, type PostSubmitType, type SubmitType } from '$types/schemas';
import checkUser from '../lib/checkUser';

export const postSubmit = async ({ game, type, comment }: PostSubmitType): Promise<void> => {
  // Report request
  console.info('postSubmit called with args:', { dataSubmit: { game, type, comment } });

  if (!checkUser('traductor')) throw new Error('Unauthorized');

  const validSubmit = PostSubmit.parse({ game, type, comment });

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
