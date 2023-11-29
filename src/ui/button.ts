//

import { tv } from "tailwind-variants";

//

export const button = tv({
  base: "fr-btn",
  variants: {
    intent: {
      warning: "bg-[--warning-425-625] hover:!bg-[--warning-425-625-hover]",
    },
  },
});
