import type { GameType } from "$types/schemas";
import { Game } from "$types/schemas";
import { changelog } from "../lib/changeLog";
import { disableLock, enableLock } from "../lib/lockMode";
import { reloadFilter } from "../lib/reloadFilter";
import { sendWebhookLogs, sendWebhookUpdate } from "../lib/webhook";
import { getGame } from "./getGame";
import { getQueryGames } from "./getQueryGames";
import { getTraductors } from "./getTraductors";

export interface GetGameArgs {
  game: GameType;
  query: {
    name: string | null;
    version: string | null;
  };
}

export const putGame = async ({
  game: dataGame,
  query,
}: GetGameArgs): Promise<void | string> => {
  // Report request
  console.info("putGame called with args:", { dataGame });

  try {
    await enableLock();

    const validGame = await Game.parse(dataGame);

    const games = await getQueryGames();

    const gameIndex = await games?.findIndex(
      (oldGame) =>
        oldGame.name === query.name && oldGame.version === query.version
    );

    if (gameIndex === undefined || gameIndex === -1) {
      console.error("No detect game putGame with index:", { gameIndex });
      throw new Error("Impossible de trouver le jeu dans la liste");
    } // TODO: duplicate game

    const convertedGame: string[] = [
      validGame.id || "",
      validGame.domain,
      `=HYPERLINK("${validGame.link}"; "${validGame.name}")`,
      validGame.version,
      validGame.tversion,
      validGame.tname.startsWith("Traduction")
        ? `=HYPERLINK("${validGame.tlink}"; "${validGame.tname}")`
        : validGame.tname,
      validGame.status,
      validGame.tags || "",
      validGame.type,
      (await dataLink(validGame.traductor, validGame.domain)).toString(),
      (await dataLink(validGame.reader, validGame.domain)).toString(),
      validGame.ttype,
      validGame.ac.toString(),
    ];

    const oldGame: GameType = await getGame(query);

    console.info("putGame convert:", { convertedGame });

    const sheet = await SpreadsheetApp.getActiveSpreadsheet();
    const gameSheet = sheet.getSheetByName("Jeux");

    if (!gameSheet) {
      console.error({ gameSheet });
      throw Error("Une erreur est survenue !");
    }

    const row = await gameSheet.getRange(`A${gameIndex + 2}:M${gameIndex + 2}`);
    await row.setValues([convertedGame]);

    await gameSheet.sort(3, true);
    reloadFilter(gameSheet);

    if (validGame.tversion !== oldGame.tversion) {
      changelog({ game: validGame.name, status: "MISE À JOUR" });
    }

    let title = "Modification d'un jeu";
    let color = 5814783;

    if (validGame.tlink !== oldGame.tlink && validGame.tlink === "n/a") {
      title = "Traduction manquante";
      color = 12256517;

      webhookUpdate(oldGame, validGame, title, color);
    } else if (validGame.tversion !== oldGame.tversion) {
      title = "Traduction mise à jour:";

      webhookUpdate(oldGame, validGame, title, color);
    } else if (validGame.tlink !== oldGame.tlink) {
      title = "Mise à jour d'un lien de traduction:";
      color = 15122688;

      webhookUpdate(oldGame, validGame, title, color);
    }

    sendWebhookLogs({
      title,
      color,
      oldGame,
      game: validGame,
    });
  } catch (error) {
    console.error(error);

    throw new Error("Un problème est survenue lors de modification du jeu");
  } finally {
    await disableLock();
  }
};

const dataLink = async (data: string | null, domain: string) => {
  if (!data) return "";

  const traductors = await getTraductors();

  if (!traductors) {
    console.error({ traductors });
    throw new Error("Une erreur est survenue !");
  }

  let result = data;

  for (let i = 0; i < traductors.length; i++) {
    const { name, links } = traductors[i];

    if (name === data && links && links.length > 0) {
      result = links[0].name;

      for (let il = 0; il < links.length; il++) {
        result = `=HYPERLINK("${links[0].link}"; "${data}")`;

        if (links[il].name === domain) {
          return `=HYPERLINK("${links[il].link}"; "${data}")`;
        }
      }
    }
  }

  return result;
};

const webhookUpdate = (
  oldGame: GameType,
  validGame: GameType,
  title: string,
  color: number
) => {
  sendWebhookUpdate({
    title,
    url: validGame.link,
    color,
    name: validGame.name,
    tversion:
      oldGame.tversion !== validGame.tversion
        ? `${oldGame.tversion} > ${validGame.tversion}`
        : validGame.tversion,
    traductor:
      oldGame.traductor !== validGame.traductor
        ? `${oldGame.traductor} > ${validGame.traductor}`
        : validGame.traductor,
    reader:
      oldGame.reader !== validGame.reader
        ? `${oldGame.reader} > ${validGame.reader}`
        : validGame.reader,
    image: oldGame.image,
  });
};
