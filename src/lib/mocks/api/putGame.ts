import { games } from '../data/game';
import sleep from '../sleep';
import { sendWebhookLogs, sendWebhookUpdate } from '../webhook';

import { getGames } from './getGames';

import { Game, GameType, QueryGameType } from '$types/schemas';
import { parse } from 'valibot';

export interface PutGameArgs {
  game: GameType;
  query: QueryGameType;
  silentMode: boolean;
}

export const putGame = async ({ game, query, silentMode }: PutGameArgs): Promise<void | string> => {
  await sleep();

  try {
    const gamesData = await getGames();

    if (!gamesData) {
      throw new Error('Impossible de récupérer la liste des jeux');
    }

    const oldGame = gamesData.find(
      (gameData: GameType) => gameData.name === query.name && gameData.version === query.version,
    );

    if (!oldGame) {
      throw new Error('Le jeu est introuvable dans la liste');
    }

    const duplicate = games?.findIndex((gameData) => gameData.name === game.name && gameData.version === game.version);

    if (duplicate !== -1) {
      return 'duplicate';
    }

    const validGame = parse(Game, game);
    console.info('mockResponse_putGame', { validGame, games });

    let title = "Modification d'un jeu";
    let color = 5814783;

    sendWebhookLogs({
      title,
      color,
      oldGame,
      game: validGame,
    });

    if (silentMode) return;

    if (validGame.tlink !== oldGame.tlink && validGame.tlink === 'n/a') {
      title = 'Traduction manquante';
      color = 12256517;

      webhookUpdate(oldGame, validGame, title, color);
    } else if (validGame.tversion !== oldGame.tversion) {
      title = 'Traduction mise à jour:';

      webhookUpdate(oldGame, validGame, title, color);
    } else if (validGame.tlink !== oldGame.tlink) {
      title = "Mise à jour d'un lien de traduction:";
      color = 15122688;

      webhookUpdate(oldGame, validGame, title, color);
    }
  } catch (error) {
    console.error('putGame: ' + error);
  }
};

const webhookUpdate = (oldGame: GameType, validGame: GameType, title: string, color: number) => {
  sendWebhookUpdate({
    title,
    url: validGame.link,
    color,
    name: validGame.name,
    tversion:
      oldGame.tversion !== validGame.tversion ? `${oldGame.tversion} > ${validGame.tversion}` : validGame.tversion,
    traductor:
      oldGame.traductor !== validGame.traductor ? `${oldGame.traductor} > ${validGame.traductor}` : validGame.traductor,
    proofreader:
      oldGame.proofreader !== validGame.proofreader
        ? `${oldGame.proofreader} > ${validGame.proofreader}`
        : validGame.proofreader,
    image: validGame.image,
  });
};
