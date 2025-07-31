//

import { Htmx_Events } from "@~/app.core/htmx";
import { raw } from "hono/html";
import type { JSX } from "hono/jsx/jsx-runtime";

//

type ToastType = "error" | "success" | "warning";

interface ToasterContainerProps {
  iconsByTypes?: Record<ToastType, JSX.Element>;
  duration?: `${number}s` | `${number}ms`;
}
export const SuccessIcon = () => (
  <svg
    class="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  </svg>
);

export const ErrorIcon = () => (
  <svg
    class="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
  </svg>
);

export const WarningIcon = () => (
  <svg
    class="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
  </svg>
);

export function ToasterContainer(props: ToasterContainerProps = {}) {
  return (
    <div
      class="fixed bottom-4 left-4 z-50"
      _={raw(`
        on toast:show(detail) from body
          -- Get the template and clone it
          set template to #toast-template
          set clone to template.cloneNode(true).content

          -- Set the message
          set messageElement to clone.querySelector('slot[name=message]')
          put detail.message into messageElement

          -- Set the icon
          set type to detail.type or 'success'
          set templateId to 'toast-icon-' + type
          set iconTemplate to #{templateId}
          if iconTemplate
            set iconClone to iconTemplate.cloneNode(true).content
            set iconContainer to clone.querySelector('slot[name=icon]')
            put iconClone into iconContainer
          end

          -- Add the toast to the container
          put clone into <hyyyper-toast-container />

          --

          on every ${Htmx_Events.enum.responseError} from body
            trigger toast:show(type: 'error', message: 'Une erreur est survenue !') on me
            halt
      `)}
    >
      {Object.entries(props.iconsByTypes ?? {}).map(([type, IconComponent]) => (
        <template id={`toast-icon-${type}`}>{IconComponent}</template>
      ))}
      <template id="toast-template">
        <div
          _={raw(`
            init wait ${props.duration ?? "5s"} then remove me
            on click from <button[aria-label='Close'] /> remove me
          `)}
          class="flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
          role="alert"
        >
          <div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-500">
            <slot name="icon"></slot>
            <span class="sr-only">Icon</span>
          </div>
          <div class="ms-3 text-sm font-normal">
            <slot name="message"></slot>
          </div>
          <button
            type="button"
            class="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300"
            aria-label="Close"
          >
            <span class="sr-only">Close</span>
            <svg
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
              />
            </svg>
          </button>
        </div>
      </template>
      <hyyyper-toast-container class="flex flex-col gap-2"></hyyyper-toast-container>
    </div>
  );
}
