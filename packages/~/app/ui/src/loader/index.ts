//

import { tv } from "tailwind-variants";

//

export const loader = tv({
  base: `
    inline-block
    h-8
    w-8
    animate-spin
    rounded-full
    border-4
    border-solid
    border-current
    border-r-transparent
    align-[-0.125em]
    motion-reduce:animate-[spin_1.5s_linear_infinite]
  `,
  slots: {
    span: `
      !absolute
      !-m-px
      !h-px
      !w-px
      !overflow-hidden
      !whitespace-nowrap
      !border-0
      !p-0
      ![clip:rect(0,0,0,0)]
    `,
  },
  variants: {
    htmx_indicator: {
      true: "htmx-indicator",
    },
  },
});
