//

import { add_organization } from "@~/app.database/seed_data";
import { beforeEach, describe, expect, test } from "bun:test";
import { AddVerifiedDomain } from "./AddVerifiedDomain";

//

describe("AddVerifiedDomain", () => {
  let organization_id: number;

  beforeEach(async () => {
    const { pg } = await import("@~/app.database/pg");
    organization_id = await add_organization({ pg });
  });

  test("updates domain verification status", async () => {
    const { pg } = await import("@~/app.database/pg");
    const add_verified_domain = AddVerifiedDomain(pg);

    const result = add_verified_domain({
      id: organization_id,
      domain: "example.com",
    });

    expect(result).toBeDefined();
  });
});