//

import { hyper_ref } from "@~/app.core/html";
import { createSlot } from "hono-slotify";
import type { JSX, PropsWithChildren } from "hono/jsx";
import { Popover } from "./Popover";

//

export interface MenuProps {
  is_open?: boolean;
}

export function Menu({ children, ...props }: PropsWithChildren<MenuProps>) {
  const $trigger = hyper_ref();
  const $popover = hyper_ref();

  return (
    <div class="relative inline-block">
      <Menu.Trigger.Renderer
        childs={children}
        target_id={$popover}
        id={$trigger}
      />
      <Popover.Context.Provider value={{ is_open: props.is_open ?? false }}>
        <Menu.Popover.Renderer
          aria-labelledby={$trigger}
          childs={children}
          id={$popover}
        />
      </Popover.Context.Provider>
    </div>
  );
}

//

Menu.Trigger = createSlot<{ id?: string; target_id: string }>();
Menu.Popover = createSlot<JSX.IntrinsicElements["div"]>();
