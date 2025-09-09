//

import { add_organization, add_user } from "@~/app.database/seed_data";
import { beforeEach, describe, expect, test } from "bun:test";
import { AddMemberToOrganization } from "./AddMemberToOrganization";

//

describe("AddMemberToOrganization", () => {
  let user_id: number;
  let organization_id: number;

  beforeEach(async () => {
    const { pg } = await import("@~/app.database/pg");
    user_id = await add_user({ pg });
    organization_id = await add_organization({ pg });
  });

  test("adds a member to an organization", async () => {
    const { pg } = await import("@~/app.database/pg");
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