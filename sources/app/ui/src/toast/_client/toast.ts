//

import config from "@~/app.core/config";
import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";

interface Toast {
  id: string;
  type: "success" | "error" | "warning";
  message: string;
}

@customElement("hyyyper-toaster")
export class Hyyyper_toaster extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    [hidden] {
      display: none;
    }
  `;

  @property({ type: Number })
  maxDuration = 5_000;

  private toasts: Toast[] = [];

  private htmxErrorHandler = this.handleHtmxError.bind(this);
  private toastShowHandler = this.handleToastShow.bind(this);

  connectedCallback() {
    super.connectedCallback();

    // Listen for HTMX events
    document.body.addEventListener("htmx:responseError", this.htmxErrorHandler);
    document.body.addEventListener("toast:show", this.toastShowHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.removeEventListener(
      "htmx:responseError",
      this.htmxErrorHandler,
    );
    document.body.removeEventListener("toast:show", this.toastShowHandler);
  }

  private handleHtmxError(event: Event) {
    const detail = (event as CustomEvent).detail;
    const message = detail?.message || "Une erreur est survenue !";
    this.showToast("error", message);
  }

  private handleToastShow(event: Event) {
    const { type = "success", message } = (event as CustomEvent).detail;
    this.showToast(type, message);
  }

  public showToast(type: Toast["type"], message: string) {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = { id, type, message };

    this.toasts = [...this.toasts, toast];
    this.requestUpdate();

    // Auto-remove after maxDuration
    setTimeout(() => {
      this.removeToast(id);
    }, this.maxDuration);
  }

  public removeToast(id: string) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
    this.requestUpdate();
  }


  private getIconClasses(type: Toast["type"]) {
    switch (type) {
      case "success":
        return "bg-blue-100 text-blue-500";
      case "error":
        return "bg-red-100 text-red-500";
      case "warning":
        return "bg-yellow-100 text-yellow-500";
      default:
        return "bg-blue-100 text-blue-500";
    }
  }

  private renderIcon(type: Toast["type"]) {
    switch (type) {
      case "success":
        return html`
          <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"
            />
          </svg>
        `;
      case "error":
        return html`
          <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
            />
          </svg>
        `;
      case "warning":
        return html`
          <svg class="h-5 w-5 fill-current" viewBox="0 0 20 20">
            <path
              d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"
            />
          </svg>
        `;
    }
  }

  render() {
    return html`
      <!--  -->
      <link rel="stylesheet" href="${config.PUBLIC_ASSETS_PATH}/tailwind.css" />

      <!--  -->
      <div
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex flex-col gap-2"
      >
        ${this.toasts.map(
          (toast) => html`
            <hyyyper-toast
              class="toast-${toast.type} pointer-events-auto flex max-w-xs items-center rounded-lg border border-gray-300 bg-white p-4 text-gray-500 shadow-sm"
              role="alert"
            >
              <div
                class="${this.getIconClasses(
                  toast.type,
                )} mr-3 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg"
              >
                ${this.renderIcon(toast.type)}
              </div>
              <div class="toast-message flex-1 text-sm font-normal">
                ${toast.message}
              </div>
              <button
                class="ml-auto cursor-pointer rounded-lg border-none bg-transparent p-1.5 text-gray-400 hover:bg-gray-100"
                @click=${() => this.removeToast(toast.id)}
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
                  />
                </svg>
              </button>
            </hyyyper-toast>
          `,
        )}
      </div>
    `;
  }
}
//

// class ToastManager {
//   private container: HTMLElement;

//   constructor() {
//     this.container = document.createElement("div");
//     this.container.className = "fixed bottom-4 left-4 z-50 flex flex-col gap-2";
//     document.body.appendChild(this.container);

//     document.body.addEventListener(
//       "toast:show",
//       this.handleToastShow.bind(this),
//     );
//     document.body.addEventListener(
//       "htmx:responseError",
//       this.handleHtmxError.bind(this),
//     );
//   }

//   private handleToastShow(event: Event) {
//     const { type = "success", message } = (event as CustomEvent).detail;
//     this.show(type, message);
//   }

//   private handleHtmxError() {
//     this.show("error", "Une erreur est survenue !");
//   }

//   show(type: "success" | "error" | "warning", message: string) {
//     const toast = document.createElement("div");
//     toast.className =
//       "flex w-full max-w-xs items-center rounded-lg border border-solid border-gray-300 bg-white p-4 text-gray-500 shadow-sm";
//     toast.setAttribute("role", "alert");

//     const iconColors = {
//       success: "bg-blue-100 text-blue-500",
//       error: "bg-red-100 text-red-500",
//       warning: "bg-yellow-100 text-yellow-500",
//     };

//     toast.innerHTML = `
//       <div class="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconColors[type] || iconColors.success}">
//         <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//         </svg>
//       </div>
//       <div class="ms-3 text-sm font-normal">${message}</div>
//       <button type="button" class="close -mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100">
//         <svg class="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 14 14">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
//         </svg>
//       </button>
//     `;

//     const closeBtn = toast.querySelector(".close");
//     closeBtn?.addEventListener("click", () => toast.remove());

//     this.container.appendChild(toast);

//     setTimeout(() => toast.remove(), 5000);
//   }
// }

// //

// new ToastManager();
