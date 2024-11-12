//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import deprecated_conseiller_numerique_email from "./deprecated_conseiller_numerique_email";

//

test("returns deprecated @conseiller-numerique.fr email", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: { cached_libelle: "🦄" },
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
  return <>{deprecated_conseiller_numerique_email()}</>;
}
