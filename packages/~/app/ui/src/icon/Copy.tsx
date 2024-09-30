//

import type { JSX } from "hono/jsx";

//
// From https://icon-sets.iconify.design/ph/copy-thin/
//
export function PhCopyThin(props: JSX.HTMLAttributes) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="size-4"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M216 36H88a4 4 0 0 0-4 4v44H40a4 4 0 0 0-4 4v128a4 4 0 0 0 4 4h128a4 4 0 0 0 4-4v-44h44a4 4 0 0 0 4-4V40a4 4 0 0 0-4-4m-52 176H44V92h120Zm48-48h-40V88a4 4 0 0 0-4-4H92V44h120Z"
      ></path>
    </svg>
  );
}
