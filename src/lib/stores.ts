import { writable } from 'svelte/store';

import type { Toast as ToastPrimitive } from '$types/index';
import type { AppConfigurationType, GameType, QueryGameType, TraductorType, UserType } from '$types/schemas';

export const sessionUser = writable<UserType | null>(null);

export const isLoading = writable<boolean>(false);
export const queryGame = writable<QueryGameType | undefined>(undefined);
export const queryGames = writable<QueryGameType[]>([]);
export const game = writable<GameType>();
export const traductors = writable<TraductorType[]>([]);

export const appConfiguration = writable<AppConfigurationType>();

export const toasts = writable<ToastPrimitive[]>([]);

interface Toast {
  milliseconds?: ToastPrimitive['milliseconds'];
  message: ToastPrimitive['message'];
  alertType: ToastPrimitive['alertType'];
}

export const newToast = (toast: Toast): void => {
  const toastData: ToastPrimitive = {
    id: new Date().toISOString(),
    milliseconds: toast.milliseconds ?? 3000,
    alertType: toast.alertType,
    message: toast.message,
  };

  toasts.update((currentToasts) => [...currentToasts, toastData]);

  setTimeout(() => {
    toasts.update((currentToasts) => currentToasts.filter((t) => t.id !== toastData.id));
  }, toastData.milliseconds);
};
