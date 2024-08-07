import * as v from 'valibot';

const User = v.object({
  email: v.union([v.pipe(v.string(), v.email()), v.nullable(v.string())]),
  roles: v.array(v.picklist(['superAdmin', 'admin'])),
  profile: v.object({
    pseudo: v.string(),
    imageUrl: v.string(),
  }),
  preferences: v.object({
    theme: v.optional(v.picklist(['light', 'dark'])),
  }),
  activity: v.array(
    v.object({
      label: v.string(),
      value: v.string(), // You can add custom validation to ensure it's an ISO string
    }),
  ),
  statistics: v.object({
    gameAdded: v.pipe(v.number(), v.minValue(0)),
    gameEdited: v.pipe(v.number(), v.minValue(0)),
  }),
});

const Game = v.object({
  id: v.string(),
  domain: v.picklist(['F95z', 'LewdCorner', 'Autre']),
  name: v.string(),
  version: v.string(),
  tversion: v.string(),
  tname: v.picklist(['Traduction', 'Traduction (mod inclus)', 'Intégrée', 'Pas de traduction']),
  status: v.picklist(['EN COURS', 'TERMINÉ', 'ABANDONNÉ']),
  tags: v.string(),
  type: v.picklist(['RenPy', 'RPGM', 'Unity', 'Unreal', 'Flash', 'HTLM', 'QSP', 'Autre', 'RenPy/RPGM', 'RenPy/Unity']),
  traductor: v.string(),
  proofreader: v.string(),
  ttype: v.picklist([
    'Traduction Humaine',
    'Traduction Automatique',
    'Traduction Semi-Automatique',
    'VO Française',
    'À tester',
    'Lien Trad HS',
  ]),
  ac: v.boolean(),
  link: v.string(),
  tlink: v.string(),
  trlink: v.optional(v.string()),
  image: v.string(),
});

const QueryGame = v.object({
  id: Game.entries.version,
  name: Game.entries.name,
  version: Game.entries.version,
});

const ScrapeGame = v.object({
  name: Game.entries.name,
  version: Game.entries.version,
  status: Game.entries.status,
  tags: Game.entries.tags,
  type: Game.entries.type,
  image: Game.entries.image,
});

const CheckerF95z = v.object({
  status: v.string(),
  msg: v.string(),
});

const GameAC = v.object({
  id: Game.entries.id,
  version: Game.entries.version,
  newVersion: Game.entries.version,
});

const Traductor = v.object({
  name: v.string(),
  links: v.array(
    v.object({
      name: v.string(),
      link: v.string(),
    }),
  ),
});

const AppConfiguration = v.object({
  appName: v.string(),
  deployingUserEmail: v.string(),
  admins: v.array(User),
});

const AppWebhooks = v.object({
  update: v.string(),
  logs: v.string(),
});

// You need to export in this format. See
// https://stackoverflow.com/questions/48791868/use-typescript-with-google-apps-script
// for more info.
// export { AppConfiguration, CheckerF95z, Game, QueryGame, ScrapeGame, Traductor, User };
export { AppConfiguration, AppWebhooks, CheckerF95z, Game, QueryGame, ScrapeGame, Traductor, User };

export type AppConfigurationType = v.InferOutput<typeof AppConfiguration>;
export type UserType = v.InferOutput<typeof User>;
export type GameType = v.InferOutput<typeof Game>;
export type QueryGameType = v.InferOutput<typeof QueryGame>;
export type TraductorType = v.InferOutput<typeof Traductor>;
export type ScrapeGameType = v.InferOutput<typeof ScrapeGame>;
export type CheckerF95zType = v.InferOutput<typeof CheckerF95z>;
export type GameACType = v.InferOutput<typeof GameAC>;
export type AppWebhooksType = v.InferOutput<typeof AppWebhooks>;
