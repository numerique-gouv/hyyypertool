//

import { Htmx_Events } from "@~/app.core/htmx";
import { describe, expect, test } from "bun:test";
import _hyperscript from "hyperscript.org";
import { render_html } from "../../testing";
import { ToasterContainer } from "./ToasterContainer";

//

describe("ToasterContainer with Hyperscript", () => {
  test("renders custom icons when iconsByTypes provided", () => {
    const customIcons = {
      success: <div class="custom-success">✓</div>,
      error: <div class="custom-error">✗</div>,
      warning: <div class="custom-warning">⚠</div>,
    };

    const html = (<ToasterContainer iconsByTypes={customIcons} />).toString();
    document.body.innerHTML = html;
    const container = document.querySelector("hyyyper-toast-container")!;

    _hyperscript.processNode(document.body);

    document.body.dispatchEvent(
      new CustomEvent("toast:show", {
        detail: { type: "success", message: "Success with icon" },
      }),
    );

    expect(render_html(container.outerHTML)).resolves.toMatchInlineSnapshot(`
      "<hyyyper-toast-container class="flex flex-col gap-2"
        ><div
          _="
                  init wait 5s then remove me
                  on click from <button[aria-label='Close'] /> remove me
                "
          class="flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
          role="alert"
        >
          <div
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500"
          >
            <slot name="icon"><div class="custom-success">✓</div></slot
            ><span class="sr-only">Icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            <slot name="message">Success with icon</slot>
          </div>
          <button
            type="button"
            class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <span class="sr-only">Close</span
            ><svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button></div
      ></hyyyper-toast-container>
      "
    `);
  });

  test("processes hyperscript and responds to toast events", () => {
    // Setup DOM
    const html = (<ToasterContainer />).toString();
    document.body.innerHTML = html;
    const container = document.querySelector("hyyyper-toast-container")!;

    // Process hyperscript
    _hyperscript.processNode(document.body);

    // Verify initial state
    expect(render_html(container.outerHTML)).resolves.toMatchInlineSnapshot(`
      "<hyyyper-toast-container class="flex flex-col gap-2"></hyyyper-toast-container>
      "
    `);

    // Trigger toast event on body (as specified in hyperscript)
    const event = new CustomEvent("toast:show", {
      detail: { type: "success", message: "Test message" },
    });

    document.body.dispatchEvent(event);

    // Check that toast was added with actual message content
    expect(render_html(container.outerHTML)).resolves.toMatchInlineSnapshot(`
      "<hyyyper-toast-container class="flex flex-col gap-2"
        ><div
          _="
                  init wait 5s then remove me
                  on click from <button[aria-label='Close'] /> remove me
                "
          class="flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
          role="alert"
        >
          <div
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500"
          >
            <slot name="icon"></slot><span class="sr-only">Icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            <slot name="message">Test message</slot>
          </div>
          <button
            type="button"
            class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <span class="sr-only">Close</span
            ><svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button></div
      ></hyyyper-toast-container>
      "
    `);
  });

  test("listen to HTMX ", () => {
    document.body.innerHTML = (<ToasterContainer />).toString();
    const container = document.querySelector("hyyyper-toast-container")!;

    _hyperscript.processNode(document.body);

    document.body.dispatchEvent(
      new CustomEvent(Htmx_Events.enum.responseError),
    );

    expect(render_html(container.outerHTML)).resolves.toMatchInlineSnapshot(`
      "<hyyyper-toast-container class="flex flex-col gap-2"
        ><div
          _="
                  init wait 5s then remove me
                  on click from <button[aria-label='Close'] /> remove me
                "
          class="flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
          role="alert"
        >
          <div
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500"
          >
            <slot name="icon"></slot><span class="sr-only">Icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            <slot name="message">Une erreur est survenue !</slot>
          </div>
          <button
            type="button"
            class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <span class="sr-only">Close</span
            ><svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button></div
      ></hyyyper-toast-container>
      "
    `);
  });

  test("handles multiple toast events", () => {
    document.body.innerHTML = (<ToasterContainer />).toString();
    const container = document.querySelector("hyyyper-toast-container")!;

    _hyperscript.processNode(document.body);

    // Add multiple toasts
    document.body.dispatchEvent(
      new CustomEvent("toast:show", {
        detail: { type: "success", message: "First toast" },
      }),
    );

    document.body.dispatchEvent(
      new CustomEvent("toast:show", {
        detail: { type: "error", message: "Second toast" },
      }),
    );

    expect(render_html(container.outerHTML)).resolves.toMatchInlineSnapshot(`
      "<hyyyper-toast-container class="flex flex-col gap-2"
        ><div
          _="
                  init wait 5s then remove me
                  on click from <button[aria-label='Close'] /> remove me
                "
          class="flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
          role="alert"
        >
          <div
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500"
          >
            <slot name="icon"></slot><span class="sr-only">Icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            <slot name="message">Second toast</slot>
          </div>
          <button
            type="button"
            class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <span class="sr-only">Close</span
            ><svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button></div
      ></hyyyper-toast-container>
      "
    `);
  });

  test("moderation workflow integration", () => {
    document.body.innerHTML = (<ToasterContainer />).toString();
    const container = document.querySelector("hyyyper-toast-container")!;

    _hyperscript.processNode(document.body);

    // Simulate moderation validation workflow
    document.body.dispatchEvent(
      new CustomEvent("toast:show", {
        detail: {
          type: "success",
          message: "Modération validée !",
          action: {
            label: "Retour à la liste",
            event: "navigate:moderations",
          },
        },
      }),
    );

    expect(render_html(container.outerHTML)).resolves.toMatchInlineSnapshot(`
      "<hyyyper-toast-container class="flex flex-col gap-2"
        ><div
          _="
                  init wait 5s then remove me
                  on click from <button[aria-label='Close'] /> remove me
                "
          class="flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
          role="alert"
        >
          <div
            class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500"
          >
            <slot name="icon"></slot><span class="sr-only">Icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            <slot name="message">Modération validée !</slot>
          </div>
          <button
            type="button"
            class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <span class="sr-only">Close</span
            ><svg
              class="h-3 w-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button></div
      ></hyyyper-toast-container>
      "
    `);
  });

  test("auto-removes toast after custom duration", async () => {
    // Use a short duration for fast testing
    document.body.innerHTML = (<ToasterContainer duration="1s" />).toString();
    const container = document.querySelector("hyyyper-toast-container")!;

    _hyperscript.processNode(document.body);

    // Add a toast
    document.body.dispatchEvent(
      new CustomEvent("toast:show", {
        detail: { type: "success", message: "Quick removal test" },
      }),
    );

    // Verify toast was added
    expect(container.children).toHaveLength(1);

    // Wait for auto-removal (1s + small buffer)
    await new Promise(resolve => setTimeout(resolve, 1100));

    // Toast should be auto-removed
    expect(container.children).toHaveLength(0);
  });
});

//
