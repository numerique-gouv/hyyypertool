//

import type { PropsWithChildren } from "hono/jsx";
import { createHash } from "node:crypto";
import { Popover } from "./Popover";
import { Trigger } from "./Trigger";

//

export function Horizontal_Menu({
  children,
  is_open = false,
}: PropsWithChildren<{ is_open?: boolean }>) {
  const uuid = `hyper_${createHash("sha1").update(crypto.randomUUID()).digest("hex")}`;
  return (
    <div class="relative inline-block">
      <Trigger for={uuid} />
      <Popover.Context.Provider value={{ is_open }}>
        <Popover id={uuid}>{children}</Popover>
      </Popover.Context.Provider>
    </div>
  );
}
