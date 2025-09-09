//

import { create_adora_pony_user, create_unicorn_organization } from "@~/identite-proconnect.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect.database/testing";
import { beforeEach, describe, expect, test } from "bun:test";
import { AddMemberToOrganization } from "./AddMemberToOrganization";

//

describe("AddMemberToOrganization", () => {
  let user_id: number;
  let organization_id: number;

  beforeEach(async () => {
    await migrate();
    await empty_database(pg);
    user_id = await create_adora_pony_user(pg);
    organization_id = await create_unicorn_organization(pg);
  });

  test("adds a member to an organization", async () => {
    const add_member_to_organization = AddMemberToOrganization(pg);

    const result = await add_member_to_organization({
      user_id,
      organization_id,
      is_external: false,
    });

    expect(result).toHaveProperty("user_id", user_id);
    expect(result).toHaveProperty("organization_id", organization_id);
    expect(result).toHaveProperty("is_external", false);
  });
});