//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import occupation_incorrectly_entered_not_blocking from "./occupation_incorrectly_entered_not_blocking";

//

test("returns incorrect name entered response", async () => {
  expect(await render_md(<Response />)).toMatchSnapshot();
});

function Response() {
  return <>{occupation_incorrectly_entered_not_blocking()}</>;
}
