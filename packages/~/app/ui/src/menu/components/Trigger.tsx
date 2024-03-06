//

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
        class="h-5 w-5"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 16 3"
      >
        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
      </svg>
    </button>
  );
}
