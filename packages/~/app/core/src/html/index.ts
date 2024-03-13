//

import { createHash } from "node:crypto";

//

export function hyper_ref() {
  return `hyper_${createHash("sha1").update(crypto.randomUUID()).digest("hex")}`;
}
