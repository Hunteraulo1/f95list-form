import { CheckerF95zType } from '$types/schemas';

export const getFetchF95z = async (id: string): Promise<string> => {
  const host = 'https://f95zone.to';
  const url = `${host}/sam/checker.php?threads=${id}`;

  console.info('getFetchF95z called with args:', { id });
  try {
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
    });
    const json: CheckerF95zType = await JSON.parse(response.getContentText());

    if (json.status === 'ok') {
      // @ts-ignore
      return json.msg[id];
    } else if (json.status === 'error') {
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
