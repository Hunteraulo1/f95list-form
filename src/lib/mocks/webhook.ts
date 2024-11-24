import type { GameType } from '$types/schemas';

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
  if (!tversion || !name) return;

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

  console.info({
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
  const fields = [];

  for (const prop in game) {
    if (prop === 'trlink') continue;

    const key = prop as keyof Omit<GameType, 'trlink'>;

    const gameProp = game[key]?.toString();
    const oldGameProp = oldGame ? oldGame[key]?.toString() : null;

    fields.push({
      name: `${prop}:`,
      value: oldGameProp && gameProp !== oldGameProp ? `${oldGameProp} **>** ${gameProp}` : gameProp,
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

  console.info({
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
            name: 'mock',
          },
        },
      ],
      components: [],
      actions: {},
    }),
  });
};
