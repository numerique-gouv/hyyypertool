//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import non_teaching_agent from "./non_teaching_agent";

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
  return <>{non_teaching_agent()}</>;
}
