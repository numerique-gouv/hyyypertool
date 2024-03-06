//

import type { PropsWithChildren } from "hono/jsx";
import { Menu, type MenuProps } from "./Menu";
import { Popover } from "./Popover";
import { Trigger } from "./Trigger";

//

export function Horizontal_Menu({
  children,
  ...menu_props
}: PropsWithChildren<MenuProps>) {
  return (
    <Menu {...menu_props}>
      <Menu.Trigger>{({ id }) => <Trigger for={id} />}</Menu.Trigger>
      <Menu.Popover>
        {({ id }) => <Popover id={id}>{children}</Popover>}
      </Menu.Popover>
    </Menu>
  );
}
