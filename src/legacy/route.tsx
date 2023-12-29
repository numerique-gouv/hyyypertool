//

import { hono_autoroute } from ":common/autorouter";

//

export default await hono_autoroute({
  basePath: "/legacy",
  dir: "src/legacy/routes",
});
