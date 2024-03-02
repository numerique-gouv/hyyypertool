//

import type {
  Moderation,
  Organization,
  User,
  schema,
} from "@~/moncomptepro.database";
import { createContext } from "hono/jsx";

//

export const RESPONSE_MESSAGE_SELECT_ID = "response-message";
export const RESPONSE_TEXTAREA_ID = "response";
export const EMAIL_SUBJECT_INPUT_ID = "mail-subject";
export const EMAIL_TO_INPUT_ID = "mail-to";

type ModerationWithUsersOrganizations = Moderation & {
  users: User;
  organizations: Organization;
};

export const ModerationPage_Context = createContext({
  moderation: {} as ModerationWithUsersOrganizations,
  domain: "",
  users_organizations: {} as
    | typeof schema.users_organizations.$inferSelect
    | undefined,
});
