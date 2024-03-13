//

import { hyper_ref } from "@~/app.core/html";
import { createSlot } from "hono-slotify";
import type { PropsWithChildren } from "hono/jsx";
import { Popover } from "./Popover";

//

export interface MenuProps {
  id?: string;
  is_open?: boolean;
}

export function Menu({ children, ...props }: PropsWithChildren<MenuProps>) {
  const uuid = hyper_ref();
  const menu_props: Required<MenuProps> = {
    id: uuid,
    ...props,
    is_open: props.is_open ?? false,
  };
  return (
    <div class="relative inline-block">
      <Menu.Trigger.Renderer childs={children} {...menu_props} />
      <Popover.Context.Provider value={{ is_open: menu_props.is_open }}>
        <Menu.Popover.Renderer childs={children} {...menu_props} />
      </Popover.Context.Provider>
    </div>
  );
}

//

Menu.Trigger = createSlot<Required<MenuProps>>();
Menu.Popover = createSlot<Required<MenuProps>>();
