//

import { type MonCompteProDatabaseCradle } from "@~/moncomptepro.database";
import { FindByEmail, GetUserInfo } from "@~/users.lib/usecase";
import { to } from "await-to-js";
import type { CoopAccount } from "../entities";

//

export function ImportCoopAccount({ pg }: MonCompteProDatabaseCradle) {
  const find_by_email = FindByEmail({ pg });
  const get_user_info = GetUserInfo({ pg });
  return async function import_coop_account(account: CoopAccount) {
    const { siret, email } = account;
    const [, user] = await to(find_by_email(email));
    if (!user) {
      // Create user
    }

    // const organizationInfo = await to(getOrganizationInfo(siret, access_token));
    // const [{ value: count }] = awaitfindByUserId pg
    //   .select({ value: drizzle_count() })
    //   .from(schema.users_organizations)
    //   .where(eq(schema.users_organizations.user_id, user_id));

    // return count;
    // let success_count = 0;
    // let rejected_invalid_email_address_count = 0;
    // let rejected_invalid_siret_count = 0;
    // let rejected_invalid_names_count = 0;
    // let rejected_invalid_org_count = 0;
    // let unexpected_error_count = 0;
    // let total = 0;
    return {};
  };
}

export type ImportCoopAccountHandler = ReturnType<typeof ImportCoopAccount>;

export type ImportCoopAccountOutput = Awaited<
  ReturnType<ImportCoopAccountHandler>
>;
