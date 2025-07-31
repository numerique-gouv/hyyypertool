//

import type { ToastAction, ToastDetail } from "./types";

//

/**
 * Server-side helper to trigger action toasts via HTMX headers
 */
export function triggerActionToast(options: {
  type: ToastDetail["type"];
  message: string;
  action: ToastAction;
  countdown?: number;
}) {
  return {
    "HX-Trigger": JSON.stringify({
      "toast:show": options,
    }),
  };
}

/**
 * Server-side helper to trigger simple toasts via HTMX headers
 */
export function triggerToast(
  type: ToastDetail["type"],
  message: string,
  duration?: number,
) {
  return {
    "HX-Trigger": JSON.stringify({
      "toast:show": { type, message, duration },
    }),
  };
}

/**
 * Helper for moderation workflow - validates and redirects with user control
 */
export function moderationValidated() {
  return triggerActionToast({
    type: "success",
    message: "Modération validée !",
    action: {
      label: "Retour à la liste",
      event: "navigate:moderations",
      target: "body",
    },
    countdown: 3,
  });
}

/**
 * Helper for user creation workflow
 */
export function userCreated(userId: string) {
  return triggerActionToast({
    type: "success",
    message: "Utilisateur créé avec succès",
    action: {
      label: "Voir le profil",
      event: "navigate:user",
      target: `#user-${userId}`,
    },
    countdown: 2,
  });
}

/**
 * Helper for email sent with undo option
 */
export function emailSent(emailId: string) {
  return triggerActionToast({
    type: "info",
    message: "Email envoyé à l'utilisateur",
    action: {
      label: "Annuler l'envoi",
      event: "email:undo",
      target: `#email-${emailId}`,
    },
    countdown: 5,
  });
}

//
