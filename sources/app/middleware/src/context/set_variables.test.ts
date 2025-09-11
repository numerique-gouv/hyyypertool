//

import { expect, test } from "bun:test";
import { set_variables } from "./set_variables";

//

test("set_variables calls set function for each key-value pair", () => {
  const mockSet = new Map();
  const setFn = mockSet.set.bind(mockSet);

  set_variables(setFn, {
    user: { id: 1, name: "Test User" },
    organization: { id: 2, title: "Test Org" },
  });

  expect(mockSet).toMatchInlineSnapshot(`
    Map {
      "user" => {
        "id": 1,
        "name": "Test User",
      },
      "organization" => {
        "id": 2,
        "title": "Test Org",
      },
    }
  `);
});
