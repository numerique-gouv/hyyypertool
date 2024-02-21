//

import env from "./env";

//

const ASSETS_PATH = `/assets/${env.VERSION}` as const;

export default { ...env, ASSETS_PATH };
