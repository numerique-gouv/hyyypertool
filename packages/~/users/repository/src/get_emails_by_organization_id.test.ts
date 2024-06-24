//

import { schema } from "@~/moncomptepro.database";
import { empty_database, migrate, pg } from "@~/moncomptepro.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { get_emails_by_organization_id } from "./get_emails_by_organization_id";

//

beforeAll(migrate);
beforeEach(empty_database);

test("returns test@example.com", async () => {
  const [{ id: user_id }] = await pg
    .insert(schema.users)
    .values({
      created_at: new Date().toISOString(),
      email: "test@example.com",
      updated_at: new Date().toISOString(),
    })
    .returning({ id: schema.users.id });
  const [{ id: organization_id }] = await pg
    .insert(schema.organizations)
    .values({
      authorized_email_domains: [],
      external_authorized_email_domains: [],
      siret: "",
      trackdechets_email_domains: [],
      verified_email_domains: [],
    })
    .returning({ id: schema.organizations.id });
  await pg.insert(schema.users_organizations).values({
    organization_id,
    user_id,
  });

  const emails = await get_emails_by_organization_id(pg, {
    organization_id,
  });

  expect(emails).toEqual([
    {
      email: "test@example.com",
    },
  ]);
});
