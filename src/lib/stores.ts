import { derived, writable } from 'svelte/store';

import type { Toast } from '$types/index';
import type { AppConfigurationType, QueryGameType, TraductorType, UserType } from '$types/schemas';

export const sessionUser = writable<UserType | null>(null);
export const userIsAdmin = derived(
  sessionUser,
  ($sessionUser) => $sessionUser?.roles.includes('admin') || $sessionUser?.roles.includes('superAdmin'),
);
export const userIsSuperAdmin = derived(sessionUser, ($sessionUser) => $sessionUser?.roles.includes('superAdmin'));

export const isLoading = writable<boolean>(false);
export const queryGame = writable<QueryGameType>();
export const queryGames = writable<QueryGameType[]>([]);
export const traductors = writable<TraductorType[]>([]);

export const appConfiguration = writable<AppConfigurationType>();

export const toasts = writable<Toast[]>([]);

export const newToast = (toast: Toast) => {
  toasts.update((currentToasts) => [...currentToasts, toast]);

  setTimeout(() => {
    toasts.update((currentToasts) => currentToasts.filter((t) => t.id !== toast.id));
  }, toast.milliseconds);
};
