//

import { render_lit_html } from "@~/app.ui/testing";
import "@~/config.happydom/register";
import { beforeEach, describe, expect, it } from "bun:test";
import "./toast";
import type { Hyyyper_toaster } from "./toast";

//

describe("Hyyyper_toaster Component", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("can be instantiated and listens to HTMX errors", async () => {
    // Create and add component to DOM
    document.body.innerHTML = (<hyyyper-toaster />).toString();
    const hyyyperToaster: Hyyyper_toaster =
      document.querySelector("hyyyper-toaster")!;

    await Promise.resolve();
    // Initially no toasts should be visible
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      ></div>
      "
    `);

    // Trigger HTMX error event
    const htmxErrorEvent = new CustomEvent("htmx:responseError", {
      detail: { error: "Test error" },
    });
    document.body.dispatchEvent(htmxErrorEvent);

    // Wait for event handling and DOM update
    await Promise.resolve();

    // Verify toast was created in DOM
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <!---->
        <hyyyper-toast
          role="alert"
          class="toast-error pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-red-100 text-red-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">
            Une erreur est survenue !
          </div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!---->
      </div>
      "
    `);
  });

  it("listens to custom toast:show events", async () => {
    document.body.innerHTML = (<hyyyper-toaster />).toString();
    const hyyyperToaster: Hyyyper_toaster =
      document.querySelector("hyyyper-toaster")!;

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Initially no toasts
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      ></div>
      "
    `);

    // Trigger custom toast event
    const toastEvent = new CustomEvent("toast:show", {
      detail: { type: "success", message: "Custom test message" },
    });
    document.body.dispatchEvent(toastEvent);

    await Promise.resolve();

    // Verify success toast was created
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <!---->
        <hyyyper-toast
          role="alert"
          class="toast-success pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-blue-100 text-blue-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">
            Custom test message
          </div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!---->
      </div>
      "
    `);
  });

  it("can show toasts using showToast public method", async () => {
    document.body.innerHTML = (<hyyyper-toaster />).toString();
    const hyyyperToaster: Hyyyper_toaster =
      document.querySelector("hyyyper-toaster")!;

    await new Promise((resolve) => setTimeout(resolve, 0));

    // Initially no toasts
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      ></div>
      "
    `);

    // Test showToast public method
    hyyyperToaster.showToast("warning", "showToast API test");

    await Promise.resolve();

    // Verify warning toast was created
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <!---->
        <hyyyper-toast
          role="alert"
          class="toast-warning pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-yellow-100 text-yellow-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">
            showToast API test
          </div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!---->
      </div>
      "
    `);

    // Test close button functionality
    const closeButton = hyyyperToaster.shadowRoot!.querySelector(
      "button",
    ) as HTMLButtonElement;
    closeButton.click();

    await new Promise((resolve) => setTimeout(resolve, 10));

    // Toast should be removed
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      ></div>
      "
    `);
  });

  it("auto-removes toasts after timeout", async () => {
    document.body.innerHTML = (<hyyyper-toaster maxDuration="10" />).toString();
    const hyyyperToaster: Hyyyper_toaster =
      document.querySelector("hyyyper-toaster")!;

    await Promise.resolve();

    // The maxDuration is already set to 10ms via the attribute

    // Add a toast
    hyyyperToaster.showToast("success", "Auto-remove test");

    await Promise.resolve();

    // Toast should be present
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <!---->
        <hyyyper-toast
          role="alert"
          class="toast-success pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-blue-100 text-blue-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">Auto-remove test</div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!---->
      </div>
      "
    `);

    // Wait for auto-removal (100ms + buffer)
    await new Promise((resolve) => setTimeout(resolve, 15));

    // Toast should be automatically removed
    expect(render_lit_html(hyyyperToaster.shadowRoot!.innerHTML)).resolves
      .toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      ></div>
      "
    `);
  });

  it("handles multiple toasts", async () => {
    document.body.innerHTML = (<hyyyper-toaster />).toString();
    const hyyyperToaster: Hyyyper_toaster =
      document.querySelector("hyyyper-toaster")!;

    await Promise.resolve();

    // Add multiple toasts
    hyyyperToaster.showToast("success", "First toast");
    hyyyperToaster.showToast("error", "Second toast");
    hyyyperToaster.showToast("warning", "Third toast");

    await Promise.resolve();

    // All toasts should be present
    const toastElements =
      hyyyperToaster.shadowRoot!.querySelectorAll("hyyyper-toast");
    expect(toastElements).toHaveLength(3);

    // Verify different types
    expect(
      render_lit_html(hyyyperToaster.shadowRoot!.innerHTML),
    ).resolves.toMatchInlineSnapshot(`
      "<!---->
      <!--  -->
      <link rel="stylesheet" href="/assets/2025.7.2/public/built/tailwind.css" />

      <!--  -->
      <div class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2">
        <!---->
        <hyyyper-toast
          role="alert"
          class="toast-success pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-blue-100 text-blue-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">First toast</div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!----><!---->
        <hyyyper-toast
          role="alert"
          class="toast-error pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-red-100 text-red-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">Second toast</div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!----><!---->
        <hyyyper-toast
          role="alert"
          class="toast-warning pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
        >
          <div
            class="bg-yellow-100 text-yellow-500 mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
          >
            <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
              ></path>
            </svg>
          </div>
          <div class="toast-message flex-1 text-sm font-normal">Third toast</div>
          <button
            class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
            aria-label="Fermer"
          >
            <svg
              class="h-3 w-3 fill-none stroke-current stroke-2"
              viewBox="0 0 14 14"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              ></path>
            </svg>
          </button>
        </hyyyper-toast>
        <!---->
      </div>
      "
    `);
  });
});

//
