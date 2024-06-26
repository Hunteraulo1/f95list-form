import { TraductorType } from '../../../types/schemas';

import type { GameType, QueryGameType } from '$types/schemas';

export const game: GameType = {
  domain: 'F95z',
  id: '6547',
  name: 'Sisterly Lust',
  link: 'https://f95zone.to/threads/6547',
  status: 'TERMINÉ',
  tags: '3dcg, anal sex, blackmail, cheating, corruption, creampie, exhibitionism, groping, group sex, handjob, harem, incest, interracial, lesbian, male domination, male protagonist, masturbation, milf, mobile game, oral sex, pregnancy, romance, sex toys, sleep sex, spanking, urination, vaginal sex, virgin, voyeurism',
  type: 'RenPy',
  version: 'v1.1.11',
  tversion: 'V1.1.2 ES',
  tname: 'Traduction',
  tlink: 'https://f95zone.to/threads/sisterly-lust-french-translation-v1-0-extra-scenes-maxo.31772/',
  traductor: 'Maxo',
  proofreader: '',
  ttype: 'Traduction Humaine',
  ac: true,
  image: '',
};

export const games: GameType[] = [
  game,
  {
    domain: 'F95z',
    id: '70317',
    name: 'A Split Existence',
    link: 'https://f95zone.to/threads/70317',
    status: 'ABANDONNÉ',
    tags: '3dcg, big ass, big tits, blackmail, corruption, drugs, female domination, groping, humiliation, humor, incest, interracial, male protagonist, masturbation, milf, paranormal, romance, sexual harassment, sleep sex, voyeurism',
    type: 'RenPy',
    version: 'v0.3',
    tversion: 'v0.3',
    tname: 'Traduction',
    tlink: 'https://drive.google.com/file/d/15yIHenTXFYyQJW9mGl3OscWJ9V4NQC6F/view?usp=sharing',
    traductor: 'Franky28',
    proofreader: '━ ₭úʍᾰ :･ﾟ✧',
    ttype: 'Traduction Humaine',
    ac: true,
    image: '',
  },
  {
    domain: 'LewdCorner',
    id: '3390',
    name: 'Found in Translation',
    link: 'https://lewdcorner.com/threads/3390',
    status: 'EN COURS',
    tags: '3dcg, animated, creampie, group sex, incest, lesbian, loli, male protagonist, masturbation, mobile game, oral sex, pregnancy, sex with others, shota, vaginal sex, virgin',
    type: 'RenPy',
    version: '0.7a',
    tversion: '0.7a',
    tname: 'Traduction',
    tlink: 'https://lewdcorner.com/threads/5133/post-46384',
    traductor: '✞ 𝕹𝖊𝖒𝖊𝖗𝖔𝖋 ✞',
    proofreader: 'ⱤØⱤɎ ₥ɆⱤ₵ɄⱤɎ',
    ttype: 'Traduction Humaine',
    ac: true,
    image: '',
  },
];

export const queryGames: QueryGameType[] = games.map((game) => ({
  id: game.id,
  name: game.name,
  version: game.version,
}));

export const traductors: TraductorType[] = [
  {
    name: 'Franky28',
    links: [
      {
        name: 'F95zone',
        link: 'https://f95zone.to/threads/75444',
      },
    ],
  },
  {
    name: 'Asterix71300',
    links: [],
  },
  {
    name: 'Frelon71',
    links: [
      {
        name: 'F95zone',
        link: 'https://f95zone.to/threads/145679',
      },
    ],
  },
];

export const checkerF95z = (id: string) => {
  switch (id) {
    case '100':
      return {
        status: 'ok',
        msg: { '100': 'v0.68' },
      };
    case '110':
      return {
        status: 'ok',
        msg: { '110': 'v4.1' },
      };
    case '150':
      return {
        status: 'ok',
        msg: { '150': 'v1.0' },
      };
    default:
      return {
        status: 'error',
        msg: 'Thread not found',
      };
  }
};

export const scrape = (domain: 'F95z' | 'LewdCorner', id: string) => {
  switch (domain) {
    case 'F95z':
      switch (id) {
        case '100':
          return {
            name: 'Camelot',
            status: 'ABANDONNÉ',
            tags: '2dcg, adventure, big tits, fantasy, handjob, male protagonist, monster girl, oral sex, rpg, sex toys',
            type: 'RPGM',
            version: 'v0.68',
            image: 'https://attachments.f95zone.to/2017/07/23177_t.png',
          };
        case '110':
          return {
            name: 'Dragon Throne',
            status: 'ABANDONNÉ',
            tags: '3dcg, adventure, combat, fantasy, male protagonist, oral sex, romance, vaginal sex',
            type: 'RPGM',
            version: 'v4.1',
            image: '',
          };
        case '150':
          return {
            name: 'Pokkaloh',
            status: 'TERMINÉ',
            tags: '2d game, dating sim, harem, male protagonist',
            type: 'Flash',
            version: 'v1.0',
            image: '',
          };
      }
  }
};
