//

import { tv } from "tailwind-variants";

//

export const button = tv({
  base: "fr-btn",
  variants: {
    intent: {
      warning: "bg-[--warning-425-625] hover:!bg-[--warning-425-625-hover]",
      danger: "bg-[--error-425-625] hover:!bg-[--error-425-625-hover]",
      dark: "bg-[--grey-0-1000] hover:!bg-[--grey-200-850]",
    },
  },
});
