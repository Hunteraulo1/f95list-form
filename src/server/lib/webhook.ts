import { getTraductors } from '../api/getTraductors';

import { AppConfiguration, type GameACType, type GameType } from '$types/schemas';

interface SendWebhookUpdateArgs {
  title: string;
  url: string;
  color: number;
  comment?: string;
  name: string;
  tversion: string;
  traductor: string;
  proofreader: string;
  image: string;
}

export const sendWebhookUpdate = async ({
  title,
  url,
  color,
  comment,
  name,
  tversion,
  traductor,
  proofreader,
  image,
}: SendWebhookUpdateArgs): Promise<void> => {
  console.info('sendWebhookUpdate ~ args:', {
    title,
    url,
    color,
    comment,
    name,
    tversion,
    traductor,
    proofreader,
    image,
  });

  const env = PropertiesService.getScriptProperties();
  const appConfiguration = env.getProperty('appConfiguration');

  if (!appConfiguration || !tversion || !name) return;

  const { webhooks } = AppConfiguration.parse(JSON.parse(appConfiguration));

  const fields = [];

  fields.push({
    name: 'Version de la traduction:',
    value: tversion,
    inline: false,
  });

  if (traductor) {
    fields.push({
      name: 'Traducteur:',
      value: traductor,
      inline: true,
    });
  }

  if (proofreader) {
    fields.push({
      name: 'Relecteur:',
      value: proofreader,
      inline: true,
    });
  }

  if (comment) {
    fields.push({
      name: 'Raison de la suppression:',
      value: comment,
      inline: false,
    });
  }

  if (fields.length === 0) {
    console.error({ fields });

    return;
  }

  UrlFetchApp.fetch(webhooks.update, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      content: '',
      tts: false,
      embeds: [
        {
          title: name,
          color,
          fields,
          author: {
            name: title,
          },
          image: {
            url: image,
          },
          url,
        },
      ],
      components: [],
      actions: {},
    }),
  });
};

interface SendWebhookLogsArgs {
  title: string;
  color: number;
  comment?: string;
  oldGame?: GameType;
  game: GameType;
}

export const sendWebhookLogs = async ({ title, color, oldGame, game, comment }: SendWebhookLogsArgs): Promise<void> => {
  console.info('sendWebhookLogs ~ args:', { title, color, oldGame, game, comment });

  const env = PropertiesService.getScriptProperties();
  const appConfiguration = env.getProperty('appConfiguration');

  if (!appConfiguration) return;

  const { webhooks } = AppConfiguration.parse(JSON.parse(appConfiguration));

  const fields = [];

  for (const prop in game) {
    if (prop === 'trlink') continue;

    const key = prop as keyof Omit<GameType, 'trlink'>;

    const dataProp = game[key]?.toString();
    const oldDataProp = oldGame ? oldGame[key]?.toString() : null;

    fields.push({
      name: `${prop}:`,
      value: oldDataProp && dataProp !== oldDataProp ? `${oldDataProp} **>** ${dataProp}` : dataProp,
      inline: false,
    });
  }

  if (comment) {
    fields.push({
      name: 'Raison de la suppression:',
      value: comment,
      inline: false,
    });
  }

  if (fields.length === 0) {
    console.error({ fields });

    return;
  }

  UrlFetchApp.fetch(webhooks.logs, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      content: '',
      tts: false,
      embeds: [
        {
          title,
          color,
          fields,
          author: {
            name: getName(),
          },
        },
      ],
      components: [],
      actions: {},
    }),
  });
};

interface SendWebhookACArgs {
  games: GameACType[];
}

export const sendWebhookAC = async ({ games }: SendWebhookACArgs): Promise<void> => {
  console.info('sendWebhookAC ~ args:', { games });

  const env = PropertiesService.getScriptProperties();
  const appConfiguration = env.getProperty('appConfiguration');

  if (!appConfiguration) return;

  const { webhooks } = AppConfiguration.parse(JSON.parse(appConfiguration));

  const fields = [];

  for (const game of games) {
    fields.push({
      name: `${game.id}:`,
      value: `${game.version} **>** ${game.newVersion}`,
      inline: false,
    });
  }

  if (fields.length === 0) {
    console.error({ fields });

    return;
  }

  UrlFetchApp.fetch(webhooks.logs, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      content: '',
      tts: false,
      embeds: [
        {
          title: 'Versions changées',
          fields,
          author: {
            name: 'Auto-Check',
          },
        },
      ],
      components: [],
      actions: {},
    }),
  });
};

export interface SendTraductorWebhookArgs {
  games: GameACType[];
}

export const sendTraductorWebhook = async ({ games }: SendTraductorWebhookArgs): Promise<void> => {
  console.info('sendTraductorWebhook ~ args:', { games });

  const env = PropertiesService.getScriptProperties();
  const appConfiguration = env.getProperty('appConfiguration');

  if (!appConfiguration) return;

  const { webhooks } = AppConfiguration.parse(JSON.parse(appConfiguration));

  const traductors = await getTraductors();

  if (!traductors) return;

  const fields = [];

  for (const game of games) {
    const index = traductors.findIndex((t) => t.name === game.traductor);

    if (!index) continue;

    const discordID = traductors[index]?.discordID;

    if (!discordID) continue;

    fields.push({
      name: `${game.name} (${game.id}): ${game.version} **>** ${game.newVersion}`,
      value: ` <@${discordID}>`,
      inline: true,
    });
  }

  if (fields.length === 0) {
    console.error({ fields });

    return;
  }

  UrlFetchApp.fetch(webhooks.traductor, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      content: '',
      tts: false,
      embeds: [
        {
          title: 'Jeux mis à jour',
          fields,
          author: {
            name: 'Auto-Check',
          },
        },
      ],
      components: [],
      actions: {},
    }),
  });
};

const getName = (): string => {
  const user = Session.getActiveUser();
  // @ts-expect-error - getUsername() is not in the types
  const username = user.getUsername();

  switch (username) {
    case 'a.fergani91':
      return 'Rory-Mercury91';
    case 'antoine.depadoux71':
      return 'frelon7144';
    case 'nougat71c2p':
      return 'Asterix71300';
    case 'hunteraulo':
      return 'Hunteraulo';
    case 'larmeedesnoobs':
      return 'Hunteraulo';
    default:
      return username || user.getEmail();
  }
};

export const sendWebhookLister = async (title: string): Promise<void> => {
  console.info('sendWebhookLister');

  const env = PropertiesService.getScriptProperties();
  const appConfiguration = env.getProperty('appConfiguration');

  if (!appConfiguration) return;

  const { webhooks } = AppConfiguration.parse(JSON.parse(appConfiguration));

  UrlFetchApp.fetch(webhooks.lister, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    payload: JSON.stringify({
      content: '',
      tts: false,
      embeds: [
        {
          title,
          author: {
            name: 'Panel de gestion',
          },
        },
      ],
      components: [],
      actions: {},
    }),
  });
};
