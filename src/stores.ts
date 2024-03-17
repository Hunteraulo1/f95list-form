import { derived, writable } from "svelte/store";
import { AppConfigurationType, UserType } from "./types/schemas";
import { QueryGame } from "./types/types";

export const sessionUser = writable<UserType | null>(null);
export const userIsAdmin = derived(sessionUser, ($sessionUser) => {
  return (
    $sessionUser?.roles.includes("admin") ||
    $sessionUser?.roles.includes("superAdmin")
  );
});

export const isLoading = writable<boolean>(false);
export const queryGame = writable<QueryGame>();
export const queryGames = writable<QueryGame[]>();

export const appConfiguration = writable<AppConfigurationType | null>(null);
