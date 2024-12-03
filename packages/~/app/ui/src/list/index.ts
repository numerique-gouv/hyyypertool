//

import { tv } from "tailwind-variants";
import { badge } from "../badge";

//

export const description_list = tv({
  base: `grid grid-cols-2 items-center gap-4`,
  slots: {
    dd: `p-0`,
    dt: badge(),
  },
});
