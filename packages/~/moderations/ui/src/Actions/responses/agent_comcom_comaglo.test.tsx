//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import { context, type Values } from "../context";
import agent_comcom_comaglo from "./agent_comcom_comaglo";

//

test("returns agent 'Communes’ -> ComCom, ComAgglo, Métropole response", async () => {
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
  return <>{agent_comcom_comaglo()}</>;
}
