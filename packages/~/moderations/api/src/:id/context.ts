//

import type {
  Moderation,
  Organization,
  User,
  schema,
} from "@~/moncomptepro.database";
import { createContext } from "hono/jsx";

//

export { EMAIL_SUBJECT_INPUT_ID, RESPONSE_TEXTAREA_ID } from "./03";

type ModerationWithUsersOrganizations = Moderation & {
  users: User;
  organizations: Organization;
};

export default createContext({
  moderation: {} as ModerationWithUsersOrganizations,
  domain: "",
  users_organizations: {} as
    | typeof schema.users_organizations.$inferSelect
    | undefined,
});
