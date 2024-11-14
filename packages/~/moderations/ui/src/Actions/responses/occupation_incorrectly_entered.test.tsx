//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import occupation_incorrectly_entered from "./occupation_incorrectly_entered";

//

test("returns missing name message", async () => {
  expect(
    await render_md(
      <context.Provider
        value={
          {
            moderation: {
              organization: { cached_libelle: "🦄", siret: "🖖" },
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
  return <>{occupation_incorrectly_entered()}</>;
}
