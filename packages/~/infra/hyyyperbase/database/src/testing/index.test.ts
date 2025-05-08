//

import { expect, test } from "bun:test";
import { migrate, pg } from ".";

//

test("migrate", async () => {
  await migrate();
  expect(await pg.query.users.findFirst()).toEqual({
    id: 1,
    name: "Anonymous",
    email: "anonymous@example.com",
  });
});
