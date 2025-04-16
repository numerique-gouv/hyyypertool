//

import { expect, test } from "bun:test";
import "htmx.org";
import _hyperscript from "hyperscript.org";
import { disable_until_htmx_afterOnLoad } from "./disable_until_htmx:afterOnLoad";

//

test("disable_until_htmx_afterOnLoad", () => {
  document.body.innerHTML = (
    <button _={disable_until_htmx_afterOnLoad}>My button</button>
  ).toString();

  _hyperscript.processNode(document.body);

  const button = document.querySelector("button")!;
  expect(button?.innerText).toEqual("My button");
  expect(button.getAttribute("disabled")).toBeNull();
  button.click();
  expect(button.getAttribute("disabled")).toBe("true");
  button.dispatchEvent(new Event("htmx:afterOnLoad"));
  expect(button.getAttribute("disabled")).toBeNull();
});
