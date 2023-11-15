//

import type { ElysiaWWW } from ":www";

export default (www: ElysiaWWW) => www.get("/", () => <h1>Hello Raaoph</h1>);
