import { games } from '../data/game';
import sleep from '../sleep';
import { sendWebhookLogs, sendWebhookUpdate } from '../webhook';

import { Game, type GameType } from '$types/schemas';
import { parse } from 'valibot';

export interface PostGameArgs {
  game: GameType;
  silentMode: boolean;
}

export const postGame = async ({ game, silentMode }: PostGameArgs): Promise<void | string> => {
  await sleep();

  const validGame = parse(Game, game);

  games.push(validGame);

  console.info('mockResponse_postGame', { validGame, games });

  const title = 'Suppression du jeu:';
  const color = 12256517;

  const { link, name, tversion, traductor, proofreader, image } = validGame;

  if (!silentMode) {
    sendWebhookUpdate({
      title,
      url: link,
      color,
      name,
      tversion,
      traductor,
      proofreader,
      image,
    });
  }

  sendWebhookLogs({
    title,
    color,
    game,
  });
};
