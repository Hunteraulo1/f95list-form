import { GameType } from "$types/schemas";

interface SendWebhookUpdateArgs {
  title: string;
  url: string;
  color: number;
  comment?: string;
  name: string;
  tversion: string;
  traductor: string;
  reader: string;
  image: string;
}

export const sendWebhookUpdate = ({
  title,
  url,
  color,
  comment,
  name,
  tversion,
  traductor,
  reader,
  image,
}: SendWebhookUpdateArgs) => {
  const env = PropertiesService.getScriptProperties();
  const link = env.getProperty("webhookUrl");

  if (!link || !tversion || !name) return null;

  let fields = [];

  fields.push({
    name: "Version de la traduction:",
    value: tversion,
    inline: false,
  });

  traductor &&
    fields.push({
      name: "Traducteur:",
      value: traductor,
      inline: true,
    });

  reader &&
    fields.push({
      name: "Relecteur:",
      value: reader,
      inline: true,
    });

  comment &&
    fields.push({
      name: "Raison de la suppression:",
      value: comment,
      inline: false,
    });

  UrlFetchApp.fetch(link, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      content: "",
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

export const sendWebhookLogs = ({
  title,
  color,
  oldGame,
  game,
  comment,
}: SendWebhookLogsArgs) => {
  const env = PropertiesService.getScriptProperties();
  const link = env.getProperty("logsUrl");

  if (!link) return null;

  let fields = [];

  for (const prop in game) {
    if (prop === "trlink") continue;

    const key = prop as keyof Omit<GameType, "trlink">;

    const gameProp = game[key]?.toString();
    const oldGameProp = oldGame ? oldGame[key]?.toString() : null;

    fields.push({
      name: `${prop}:`,
      value:
        oldGameProp && gameProp !== oldGameProp
          ? `${oldGameProp} > ${gameProp}`
          : gameProp,
      inline: false,
    });
  }

  if (comment) {
    fields.push({
      name: "Raison de la suppression:",
      value: comment,
      inline: false,
    });
  }

  UrlFetchApp.fetch(link, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    payload: JSON.stringify({
      content: "",
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

const getName = () => {
  const user = Session.getActiveUser();
  // @ts-ignore
  const username = user.getUsername();

  switch (username) {
    case "a.fergani91":
      return "Rory-Mercury91";
    case "antoine.depadoux71":
      return "frelon7144";
    case "nougat71c2p":
      return "Asterix71300";
    case "hunteraulo":
      return "Hunteraulo";
    case "larmeedesnoobs":
      return "Hunteraulo";
    default:
      return username || user.getEmail();
  }
};
