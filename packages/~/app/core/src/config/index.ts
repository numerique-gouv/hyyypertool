//

import env from "./env";

//

const ASSETS_PATH = `/assets/${env.VERSION}` as const;
const PUBLIC_ASSETS_PATH = `/assets/${env.VERSION}/public/assets` as const;

export default { ...env, ASSETS_PATH, PUBLIC_ASSETS_PATH };
