export const sendWebhook = () => {
  fetch(import.meta.env.VITE_DISCORD_UPDATE, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "**Traduction mise à jour:**",
      tts: false,
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
