//

import { beforeEach, expect, test } from "bun:test";
import "htmx.org";
import _hyperscript from "hyperscript.org";
import { copy_text_content_to_clipboard } from "./copy_text_content_to_clipboard";

//

beforeEach(async () => {
  await window.navigator.clipboard.write([]);
});

test("copy the text context of a div", async () => {
  const selector = "message";
  document.body.innerHTML = (
    <>
      <button _={copy_text_content_to_clipboard(`#${selector}`)}>
        My button
      </button>
      <div id={selector}>foo </div>
    </>
  ).toString();

  _hyperscript.processNode(document.body);

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  expect(await window.navigator.clipboard.readText()).toBe("foo");
});
