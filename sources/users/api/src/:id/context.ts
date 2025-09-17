//

import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetUserById } from "@~/users.repository";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadUserPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number },
) {
  const get_user_by_id = GetUserById(pg, {
    columns: {
      created_at: true,
      email_verified: true,
      email: true,
      family_name: true,
      given_name: true,
      id: true,
      job: true,
      last_sign_in_at: true,
      phone_number: true,
      reset_password_sent_at: true,
      sign_in_count: true,
      updated_at: true,
      verify_email_sent_at: true,
      totp_key_verified_at: true,
    },
  });

  return {
    user: await get_user_by_id(id),
  };
}

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadUserPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.users[":id"].$get;

type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
