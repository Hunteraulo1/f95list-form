import type { CheckerF95zType, GameType } from '$types/schemas';

const host = 'https://f95zone.to';

export const getFetchF95z = async (id: GameType['id']): Promise<string> => {
  if (!id) throw new Error('id is undefined');

  const url = `${host}/sam/checker.php?threads=${id}`;

  console.info('getFetchF95z called with args:', { id });
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
