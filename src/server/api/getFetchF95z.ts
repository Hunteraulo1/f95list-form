import type { CheckerF95zType, GameType } from '$types/schemas';
import { F95host } from '../env';

export const getFetchF95z = async (id: GameType['id']): Promise<string> => {
  if (!id) throw new Error('id is undefined');

  const url = `${F95host}/sam/checker.php?threads=${id}`;

  try {
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
    });
    const json: CheckerF95zType = await JSON.parse(response.getContentText());

    if (json.status === 'ok') {
      return json.msg[id];
    }
    if (json.status === 'error') {
      console.error(`${json.msg}`);
    } else {
      console.error(`${json.status}`);
    }

    throw new Error('getFetchF95z no return');
  } catch (error) {
    console.error('Error fetching data:', error);

    throw new Error('Error fetching data');
  }
};
