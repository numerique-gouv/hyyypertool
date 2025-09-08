//

export interface ToastAction {
  label: string;
  event: string;
  target?: string;
}

export interface ToastDetail {
  type: "success" | "error" | "warning" | "info";
  message: string;
  action?: ToastAction;
  countdown?: number;
  duration?: number;
}

export interface ToastOptions {
  duration?: number;
  countdown?: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}

//