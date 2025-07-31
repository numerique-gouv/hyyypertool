//

import { beforeAll, describe, expect, setSystemTime, test } from "bun:test";
import {
  emailSent,
  moderationValidated,
  triggerActionToast,
  triggerToast,
  userCreated,
} from "./helpers";

//

beforeAll(() => {
  setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
});

describe("Toast Helpers", () => {
  test("triggerToast creates simple toast headers", () => {
    const headers = triggerToast("success", "Operation completed!");

    expect(headers).toMatchInlineSnapshot(`
{
  "HX-Trigger": "{"toast:show":{"type":"success","message":"Operation completed!"}}",
}
`);
  });

  test("triggerActionToast creates action toast headers", () => {
    const headers = triggerActionToast({
      type: "success",
      message: "User created",
      action: {
        label: "View Profile",
        event: "navigate:user",
      },
      countdown: 3,
    });

    expect(headers).toMatchInlineSnapshot(`
{
  "HX-Trigger": "{"toast:show":{"type":"success","message":"User created","action":{"label":"View Profile","event":"navigate:user"},"countdown":3}}",
}
`);
  });

  test("moderationValidated helper for workflow", () => {
    const headers = moderationValidated();

    expect(headers).toMatchInlineSnapshot(`
{
  "HX-Trigger": "{"toast:show":{"type":"success","message":"Modération validée !","action":{"label":"Retour à la liste","event":"navigate:moderations","target":"body"},"countdown":3}}",
}
`);
  });

  test("userCreated helper for workflow", () => {
    const headers = userCreated("123");

    expect(headers).toMatchInlineSnapshot(`
{
  "HX-Trigger": "{"toast:show":{"type":"success","message":"Utilisateur créé avec succès","action":{"label":"Voir le profil","event":"navigate:user","target":"#user-123"},"countdown":2}}",
}
`);
  });

  test("emailSent helper with undo action", () => {
    const headers = emailSent("email-456");

    expect(headers).toMatchInlineSnapshot(`
{
  "HX-Trigger": "{"toast:show":{"type":"info","message":"Email envoyé à l'utilisateur","action":{"label":"Annuler l'envoi","event":"email:undo","target":"#email-email-456"},"countdown":5}}",
}
`);
  });
});

//
