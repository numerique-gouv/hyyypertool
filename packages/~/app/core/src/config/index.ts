//

import type { App_Env } from "./env";
import env from "./env";

//

const ASSETS_PATH = `/assets/${env.VERSION}` as const;
const PUBLIC_ASSETS_PATH = `/assets/${env.VERSION}/public/built` as const;

export default { ...env, ASSETS_PATH, PUBLIC_ASSETS_PATH };

export interface App_Config extends App_Env {
  ASSETS_PATH: typeof ASSETS_PATH;
  PUBLIC_ASSETS_PATH: typeof PUBLIC_ASSETS_PATH;
}
