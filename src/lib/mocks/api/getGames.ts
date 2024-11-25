import { Game, type GameType } from '$types/schemas';
import { games as gamesData } from '../data/game';

export const getGames = async (): Promise<GameType[]> => {
  console.info('getGames');

  const result = gamesData.map((game) => Game.parse(game));

  console.info('getGames ~ result:', result);

  return result;
};
