//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import user_with_existing_pc_account from "./user_with_existing_pc_account";

//

test("returns user with existing pc account", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            domain: "🧨",
            moderation: {
              organization: { cached_libelle: "🦄" },
              user: { email: "💌" },
            },
          } as Values
        }
      >
        <Response />
      </context.Provider>,
    ),
  ).toMatchSnapshot();
});

function Response() {
  return <>{user_with_existing_pc_account()}</>;
}
