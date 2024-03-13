//

import { createHash } from "node:crypto";

//

export function hyper_ref() {
  return `hyyyper_${createHash("sha1").update(crypto.randomUUID()).digest("hex")}`;
}
