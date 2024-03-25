//

import { GlobalRegistrator } from "@happy-dom/global-registrator";

// NOTE(douglasduteil): delete global.navigator
// Ensure that the global.navigator is not defined to avoid conflicts with the
// Navigator object from the browser.
delete (global as any)["navigator"];

//

GlobalRegistrator.register();
