//

import type { Main_Layout_Props } from "./main";
import type { Root_Layout_Props } from "./root";

//

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: Root_Layout_Props | Main_Layout_Props,
    ): Response | Promise<Response>;
  }
}
