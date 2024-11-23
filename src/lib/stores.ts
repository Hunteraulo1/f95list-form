import { writable } from 'svelte/store';

import type { Toast as ToastPrimitive } from '$types/index';
import type { AppConfigurationType, QueryGameType, TraductorType, UserType } from '$types/schemas';

export const sessionUser = writable<UserType | null>(null);

export const isLoading = writable<boolean>(false);
export const queryGame = writable<QueryGameType>();
export const queryGames = writable<QueryGameType[]>([]);
export const traductors = writable<TraductorType[]>([]);

export const appConfiguration = writable<AppConfigurationType>();

export const toasts = writable<Toast[]>([]);

interface Toast {
  id?: ToastPrimitive['id'];
  milliseconds?: ToastPrimitive['milliseconds'];
  message: ToastPrimitive['message'];
  alertType: ToastPrimitive['alertType'];
}

export const newToast = (toast: Toast) => {
  toast.id = toast.id ?? new Date().toISOString();
  toast.milliseconds = toast.milliseconds ?? 3000;

  toasts.update((currentToasts) => [...currentToasts, toast]);

  setTimeout(() => {
    toasts.update((currentToasts) => currentToasts.filter((t) => t.id !== toast.id));
  }, toast.milliseconds);
};
