import { z } from "zod";

const User = z.object({
  email: z.string().email(),
  roles: z.array(z.enum(["superAdmin", "admin"])),
  profile: z.object({
    pseudo: z.string(),
    imageUrl: z.string(),
  }),
  preferences: z.object({
    theme: z.enum(["light", "dark"]).optional(),
  }),
  activity: z.array(
    z.object({
      label: z.string(),
      value: z.string(), // You can add custom validation to ensure it's an ISO string
    })
  ),
});

const Game = z.object({
  id: z.string(),
  domain: z.enum(["F95z", "LewdCorner", "Autre"]),
  name: z.string().min(1),
  version: z.string().min(1),
  tversion: z.string().min(1),
  tname: z.enum([
    "Traduction",
    "Traduction (mod inclus)",
    "Intégrée",
    "Pas de traduction",
  ]),
  status: z.enum(["EN COURS", "TERMINÉ", "ABANDONNÉ"]),
  tags: z.string(),
  type: z.enum([
    "RenPy",
    "RPGM",
    "Unity",
    "Unreal",
    "Flash",
    "HTLM",
    "QSP",
    "Autre",
    "RenPy/RPGM",
    "RenPy/Unity",
  ]),
  traductor: z.string(),
  reader: z.string(),
  ttype: z.enum([
    "Traduction Humaine",
    "Traduction Automatique",
    "Traduction Semi-Automatique",
    "VO Française",
    "À tester",
    "Lien Trad HS",
  ]),
  ac: z.boolean(),
  link: z.string(),
  tlink: z.string().url().or(z.string().nullable()),
  trlink: z.string().url().or(z.string().nullable()).optional(),
  image: z.string(),
});

const QueryGame = z.object({
  name: Game.shape.name,
  version: Game.shape.version,
});

const ScrapeGame = z.object({
  name: Game.shape.name,
  version: Game.shape.version,
  status: Game.shape.status,
  tags: Game.shape.tags,
  type: Game.shape.type,
});

const CheckerF95z = z.object({
  status: z.string(),
  msg: z.record(z.string()),
});

const Traductor = z.object({
  name: z.string(),
  links: z
    .array(
      z.object({
        name: z.string(),
        link: z.string(),
      })
    )
    .optional(),
});

const AppConfiguration = z.object({
  appName: z.string(),
  deployingUserEmail: z.string(),
  admins: z.array(User),
});

// You need to export in this format. See
// https://stackoverflow.com/questions/48791868/use-typescript-with-google-apps-script
// for more info.
// export { AppConfiguration, CheckerF95z, Game, QueryGame, ScrapeGame, Traductor, User };
export {
  AppConfiguration,
  CheckerF95z,
  Game,
  QueryGame,
  ScrapeGame,
  Traductor,
  User,
};

export type AppConfigurationType = z.infer<typeof AppConfiguration>;
export type UserType = z.infer<typeof User>;
export type GameType = z.infer<typeof Game>;
export type QueryGameType = z.infer<typeof QueryGame>;
export type TraductorType = z.infer<typeof Traductor>;
export type ScrapeGameType = z.infer<typeof ScrapeGame>;
export type CheckerF95zType = z.infer<typeof CheckerF95z>;
