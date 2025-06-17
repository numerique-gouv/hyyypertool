//

import { $ } from "bun";

//

const e2e_dirname = new URL("../e2e", import.meta.url).pathname;

await $`bun install`.cwd(e2e_dirname);
await $`bun run studio`.cwd(e2e_dirname);
