//

import { render_md } from "@~/app.ui/testing";
import { expect, test } from "bun:test";
import name_incorrectly_entered from "./name_incorrectly_entered";

//

test("returns incorrect name entered response", async () => {
  expect(await render_md(<Response />)).toMatchSnapshot();
});

function Response() {
  return <>{name_incorrectly_entered()}</>;
}
