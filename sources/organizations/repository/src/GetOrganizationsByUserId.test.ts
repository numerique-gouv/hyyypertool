//

import { add_user_to_organization, pg } from "@~/identite-proconnect.database/testing";
import { beforeEach, describe, expect, test } from "bun:test";
import { GetOrganizationsByUserId } from "./GetOrganizationsByUserId";

//

describe("GetOrganizationsByUserId", () => {
  let user_id: number;

  beforeEach(async () => {
    user_id = await add_user_to_organization({ pg });
  });

  test("returns organizations for a user", async () => {
    const get_organizations_by_user_id = GetOrganizationsByUserId(pg);

    const result = await get_organizations_by_user_id({
      user_id,
    });

    expect(result.count).toBeGreaterThan(0);
    expect(result.organizations).toHaveLength(result.count);
    expect(result.organizations[0]).toHaveProperty("id");
    expect(result.organizations[0]).toHaveProperty("siret");
  });

  test("supports pagination", async () => {
    const get_organizations_by_user_id = GetOrganizationsByUserId(pg);

    const result = await get_organizations_by_user_id({
      user_id,
      pagination: { page: 0, page_size: 1 },
    });

    expect(result.organizations).toHaveLength(Math.min(1, result.count));
  });
});