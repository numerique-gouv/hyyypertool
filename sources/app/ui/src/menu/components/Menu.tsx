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
  const $trigger = hyper_ref("menu_trigger");
  const $popover = hyper_ref("menu_popover");
  const is_open = props.is_open ?? false;

  return (
    <div class="relative inline-block">
      <Menu.Trigger.Renderer
        aria-controls={$popover}
        aria-expanded={is_open}
        aria-haspopup="menu"
        childs={children}
        id={$trigger}
        role="button"
        target_id={$popover}
      />
      <Popover.Context.Provider value={{ is_open }}>
        <Menu.Popover.Renderer
          aria-hidden={!is_open}
          aria-labelledby={$trigger}
          childs={children}
          id={$popover}
          role="menu"
        />
      </Popover.Context.Provider>
    </div>
  );
}

//

Menu.Trigger = createSlot<
  JSX.IntrinsicElements["div"] & { target_id: string }
>();
Menu.Popover = createSlot<JSX.IntrinsicElements["div"]>();
