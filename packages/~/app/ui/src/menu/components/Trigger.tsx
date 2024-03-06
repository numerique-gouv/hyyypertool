//

import { visually_hidden } from "../../visually_hidden";

export function Trigger({ for: _for }: { for: string }) {
  return (
    <button
      _={`on click toggle @hidden on #${_for}`}
      class="
      inline-flex items-center rounded-lg
      bg-white p-2 text-center text-sm font-medium text-gray-900
      hover:bg-gray-100
      focus:outline-none focus:ring-4 focus:ring-gray-50
      "
      type="button"
    >
      <svg
        aria-hidden="true"
        class="h-5 w-5"
        fill="currentColor"
        focusable="false"
        viewBox="0 0 16 3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
      </svg>

      <span class={visually_hidden()}>Menu</span>
    </button>
  );
}
