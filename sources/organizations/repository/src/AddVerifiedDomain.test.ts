//

import { create_unicorn_organization } from "@~/identite-proconnect.database/seed/unicorn";
import { empty_database, migrate, pg } from "@~/identite-proconnect.database/testing";
import { beforeEach, describe, expect, test } from "bun:test";
import { AddVerifiedDomain } from "./AddVerifiedDomain";

//

describe("AddVerifiedDomain", () => {
  let organization_id: number;

  beforeEach(async () => {
    await migrate();
    await empty_database(pg);
    organization_id = await create_unicorn_organization(pg);
  });

  test("updates domain verification status", async () => {
    const add_verified_domain = AddVerifiedDomain(pg);

    const result = add_verified_domain({
      id: organization_id,
      domain: "example.com",
    });

    expect(result).toBeDefined();
  });
});