import { z } from 'zod';

const User = z.object({
  email: z.string().email().or(z.string().nullable()),
  role: z.enum(['superAdmin', 'admin', 'traductor', 'user']),
  profile: z.object({
    pseudo: z.string(),
    imageUrl: z.string().or(z.literal('')),
  }),
  preferences: z.object({
    theme: z.enum(['emerald', 'night']).optional(),
  }),
  activity: z.array(
    z.object({
      label: z.string(),
      value: z.string().datetime(),
    }),
  ),
  statistics: z.object({
    gameAdded: z.number().min(0),
    gameEdited: z.number().min(0),
  }),
});

const Game = z.object({
  id: z.number().nullable(),
  domain: z.enum(['F95z', 'LewdCorner', 'Autre']),
  name: z.string().min(1),
  version: z.string().min(1),
  tversion: z.string().min(1),
  tname: z.enum(['Traduction', 'Traduction (mod inclus)', 'Intégrée', 'Pas de traduction']),
  status: z.enum(['EN COURS', 'TERMINÉ', 'ABANDONNÉ']),
  tags: z.string(),
  type: z.enum(['RenPy', 'RPGM', 'Unity', 'Unreal', 'Flash', 'HTLM', 'QSP', 'Autre', 'RenPy/RPGM', 'RenPy/Unity']),
  traductor: z.string(),
  proofreader: z.string(),
  ttype: z.enum([
    'Traduction Humaine',
    'Traduction Automatique',
    'Traduction Semi-Automatique',
    'VO Française',
    'À tester',
    'Lien Trad HS',
  ]),
  ac: z.boolean(),
  link: z.string(),
  tlink: z.string().or(z.literal('')),
  trlink: z.string().optional().or(z.literal('')),
  image: z.string(),
});

const QueryGame = z.object({
  id: Game.shape.id,
  name: Game.shape.name,
  version: Game.shape.version,
});

const ScrapeGame = z.object({
  name: Game.shape.name.nullable(),
  version: Game.shape.version.nullable(),
  status: Game.shape.status.nullable(),
  tags: Game.shape.tags.nullable(),
  type: Game.shape.type.nullable(),
  image: Game.shape.image.nullable(),
});

const CheckerF95z = z.object({
  status: z.string(),
  msg: z.record(z.string()),
});

const GameAC = z.object({
  id: Game.shape.id,
  version: Game.shape.version,
  newVersion: Game.shape.version,
  traductor: Game.shape.traductor,
  name: Game.shape.name,
});

const Traductor = z.object({
  name: z.string(),
  links: z.array(
    z.object({
      name: z.string(),
      link: z.string().or(z.literal('')),
    }),
  ),
  discordID: z.string().or(z.literal('')),
});

const AppConfiguration = z.object({
  appName: z.string(),
  deployingUserEmail: z.string(),
  webhooks: z.object({
    update: z.string().or(z.literal('')),
    logs: z.string().or(z.literal('')),
    traductor: z.string().or(z.literal('')),
  }),
});

const Submit = z.object({
  query: z.optional(QueryGame),
  email: User.shape.email,
  date: z.string().datetime(),
  status: z.enum(['wait', 'validated', 'rejected']),
  type: z.enum(['add', 'edit', 'delete']),
  comment: z.string().or(z.literal('')),
  game: Game,
  reason: z.string().or(z.literal('')),
});

const PostSubmit = z.object({
  query: Submit.shape.query,
  game: Submit.shape.game,
  type: Submit.shape.type,
  comment: Submit.shape.comment,
});

export { AppConfiguration, CheckerF95z, Game, PostSubmit, QueryGame, ScrapeGame, Submit, Traductor, User };

export type AppConfigurationType = z.infer<typeof AppConfiguration>;
export type CheckerF95zType = z.infer<typeof CheckerF95z>;
export type GameACType = z.infer<typeof GameAC>;
export type GameType = z.infer<typeof Game>;
export type PostSubmitType = z.infer<typeof PostSubmit>;
export type QueryGameType = z.infer<typeof QueryGame>;
export type ScrapeGameType = z.infer<typeof ScrapeGame>;
export type SubmitType = z.infer<typeof Submit>;
export type TraductorType = z.infer<typeof Traductor>;
export type UserType = z.infer<typeof User>;
