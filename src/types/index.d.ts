/// <reference types="google-apps-script" />

export interface Toast {
  id: string
  message: string
  milliseconds: number
  alertType: "warning" | "info" | "success" | "error"
}
