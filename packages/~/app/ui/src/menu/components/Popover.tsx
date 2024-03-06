//

import { createContext, useContext, type PropsWithChildren } from "hono/jsx";
import { tv } from "tailwind-variants";

//

export function Popover({ children, id }: PropsWithChildren<{ id: string }>) {
  const { is_open } = useContext(Popover.Context);
  const base = styles();
  return (
    <div
      class={base}
      id={id}
      hidden={!is_open}
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="menu-button"
      tabindex={-1}
    >
      <div class="py-1" role="none">
        {children}
      </div>
    </div>
  );
}

Popover.Context = createContext({ is_open: false });

const styles = tv({
  base: `
    focus:outline-nones
    absolute
    right-0
    z-10
    mt-2
    w-44
    origin-top-right
    divide-y
    divide-gray-100
    rounded-md
    bg-white
    shadow
    `,
  variants: {},
});
