export const sendWebhook = (logsMode = false) => {
  const env = PropertiesService.getScriptProperties();
  const link = logsMode
    ? env.getProperty("webhookUrl")
    : env.getProperty("logsUrl");

  link &&
    UrlFetchApp.fetch(link, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      payload: JSON.stringify({
        content: "",
        tts: false,
        components: [
          {
            type: 1,
            components: [
              {
                style: 5,
                label: `Liste des traductions`,
                url: `https://docs.google.com/spreadsheets/d/1ELRF0kpF8SoUlslX5ZXZoG4WXeWST6lN9bLws32EPfs?gid=1224125898`,
                disabled: false,
                emoji: {
                  id: null,
                  name: `📋`,
                },
                type: 2,
              },
            ],
          },
        ],
        embeds: [
          {
            type: "rich",
            title: `Photo Hunt`,
            description: "",
            color: 0x58baff,
            fields: [
              {
                name: `Version de la traduction:`,
                value: `v0.26 > v0.271`,
              },
              {
                name: `Traducteur:`,
                value: `Frelon71`,
                inline: true,
              },
              {
                name: `Relecteur:`,
                value: `Frelon71`,
                inline: true,
              },
            ],
            image: {
              url: `https://attachments.f95zone.to/2019/10/440908_440669_f95_banner_4.png`,
              height: 0,
              width: 0,
            },
            url: `https://f95zone.to/threads/25264`,
          },
        ],
      }),
    });
};
