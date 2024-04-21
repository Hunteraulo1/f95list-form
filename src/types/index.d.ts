/// <reference types="google-apps-script" />

export interface Toast {
  id: string;
  message: string;
  milliseconds: number;
  alertType: string;
}
