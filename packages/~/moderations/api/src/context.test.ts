//

import { expect, test } from "bun:test";
import { z_query } from "./context";

//

test("z_query > empty object", () => {
  const search = z_query.parse({});

  expect(search).toEqual({
    email: "",
    hide_join_organization: false,
    hide_non_verified_domain: false,
    processed_requests: false,
    siret: "",
  });
});

test("z_query > day 2011-01-11", () => {
  const search = z_query.parse({ day: "2011-01-11" });

  expect(search).toEqual({
    day: new Date("2011-01-11"),
    email: "",
    hide_join_organization: false,
    hide_non_verified_domain: false,
    processed_requests: false,
    siret: "",
  });
});
