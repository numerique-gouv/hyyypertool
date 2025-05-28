//

import { tv } from "tailwind-variants";

//
export const visually_hidden = tv({
  base: `
    !absolute
    -m-px!
    h-px!
    w-px!
    overflow-hidden!
    whitespace-nowrap!
    border-0!
    p-0!
    [clip:rect(0,0,0,0)]!
  `,
});
