//

import { beforeEach, expect, test } from "bun:test";
import "htmx.org";
import _hyperscript from "hyperscript.org";
import { copy_to_clipboard } from "./copy_to_clipboard";

//

beforeEach(async () => {
  await window.navigator.clipboard.write([]);
});

test("copy_to_clipboard > textarea", async () => {
  const selector = "message";
  document.body.innerHTML = `
  <button _="${copy_to_clipboard(`#${selector}`)}" >My button</button>
  <input id="${selector}" value="foo"></textarea>
  `;

  _hyperscript.processNode(document.body);

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  expect(await window.navigator.clipboard.readText()).toBe("foo");
});

test("copy_to_clipboard > input", async () => {
  const selector = "message";
  document.body.innerHTML = `
  <button _="${copy_to_clipboard(`#${selector}`)}" >My button</button>
  <textarea id="${selector}">foo</textarea>
  `;

  _hyperscript.processNode(document.body);

  expect(await window.navigator.clipboard.readText()).toBe("");

  const button = document.querySelector("button")!;
  button.click();

  expect(await window.navigator.clipboard.readText()).toBe("foo");
});
