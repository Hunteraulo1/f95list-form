import { z } from "zod";

// const UserPreferences = z.record(z.any());
const UserPreferences = z.object({
  theme: z.enum(["light", "dark"]).optional(),
});

const UserProfile = z
  .object({
    imageUrl: z.string(),
  })
  .and(z.record(z.string()))
  .optional();

const UserActivity = z.object({
  label: z.string(),
  value: z.string(), // You can add custom validation to ensure it's an ISO string
});

const UserRoles = z.array(z.enum(["superAdmin", "admin"]));

const User = z.object({
  email: z.string().email(),
  roles: UserRoles,
  profile: UserProfile,
  preferences: UserPreferences,
  activity: z.array(UserActivity),
});

const Game = z.object({
  id: z.string(),
  domain: z.enum(["F95z", "LewdCorner", "Autre"]),
  name: z.string().min(1),
  version: z.string().min(1),
  tversion: z.string().min(1),
  tname: z.enum([
    "Traduction",
    "Traduction (mod inclu)",
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
  ]),
  ac: z.boolean(),
  link: z.string().url(),
  tlink: z.string().url().or(z.string().nullable()),
  trlink: z.string().url().or(z.string().nullable()).optional(),
});

const QueryGame = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
});

const ScrapeGame = z.object({
  name: z.string(),
  version: z.string(),
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
    "",
  ]),
});

const AppConfiguration = z.object({
  appName: z.string(),
  deployingUserEmail: z.string(),
  admins: z.array(User),
});

// You need to export in this format. See
// https://stackoverflow.com/questions/48791868/use-typescript-with-google-apps-script
// for more info.
export {
  AppConfiguration,
  Game,
  QueryGame,
  User,
  UserActivity,
  UserPreferences,
  UserProfile,
};

export type AppConfigurationType = z.infer<typeof AppConfiguration>;
export type UserPreferencesType = z.infer<typeof UserPreferences>;
export type UserProfileType = z.infer<typeof UserProfile>;
export type UserActivityType = z.infer<typeof UserActivity>;
export type UserType = z.infer<typeof User>;
export type GameType = z.infer<typeof Game>;
export type QueryGameType = z.infer<typeof QueryGame>;
export type ScrapeGameType = z.infer<typeof ScrapeGame>;
