//

import { expect, test } from "bun:test";
import "htmx.org";
import _hyperscript from "hyperscript.org";
import { set_prefers_color_scheme } from "./prefers_color_scheme";

//

test("set_prefers_color_scheme", () => {
  document.body.innerHTML = `
  <html _="${set_prefers_color_scheme}" ></html>
  `;

  _hyperscript.processNode(document.body);

  //

  const html = document.querySelector("html")!;
  expect(html.outerHTML).toEqual("My html");
  // expect(button.getAttribute("disabled")).toBeNull();
  // button.click();
  // expect(button.getAttribute("disabled")).toBe("true");
  // button.dispatchEvent(new Event("htmx:afterOnLoad"));
  // expect(button.getAttribute("disabled")).toBeNull();
});
