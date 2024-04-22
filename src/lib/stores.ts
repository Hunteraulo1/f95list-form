import type {
  AppConfigurationType,
  QueryGameType,
  UserType,
} from "$types/schemas";
import { derived, writable } from "svelte/store";

export const sessionUser = writable<UserType | null>(null);
export const userIsAdmin = derived(sessionUser, ($sessionUser) => {
  return (
    $sessionUser?.roles.includes("admin") ||
    $sessionUser?.roles.includes("superAdmin")
  );
});
export const userIsSuperAdmin = derived(sessionUser, ($sessionUser) => {
  return $sessionUser?.roles.includes("superAdmin");
});

export const isLoading = writable<boolean>(false);
export const queryGame = writable<QueryGameType>();
export const queryGames = writable<QueryGameType[]>([]);

export const appConfiguration = writable<AppConfigurationType>();
