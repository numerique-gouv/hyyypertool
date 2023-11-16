//

import { version } from ":package.json";

//

export default {
  VERSION: Bun.env.VERSION ?? version,
  PORT: Bun.env.PORT ?? 3000,
  NODE_ENV: Bun.env.NODE_ENV ?? "development",
  DEPLOY_ENV: Bun.env.DEPLOY_ENV ?? "preview",
};
