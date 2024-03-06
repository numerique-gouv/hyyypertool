//

import { cloneElement, isValidElement, type Child, type FC } from "hono/jsx";
import { raw } from "hono/utils/html";

//
// Inspired by https://github.com/andrey-skl/react-slotify/blob/6317a858696544c4d17db3d1823625beece3412c/src/index.tsx
//

interface RendererProps {
  childs: Child | undefined;
  children?: Child | undefined;
}

type RendererType<P> = FC<RendererProps & P>;

type SlotProps<P> = {
  showChildren?: boolean;
  restProps?: P & { defaultChildren: Child };
};

type NormalOrFunctionChildren<P> =
  | Child
  | undefined
  | ((props: P & { defaultChildren: Child | undefined }) => Child | undefined);

export type SlotType<P> = FC<
  SlotProps<P> & { children?: NormalOrFunctionChildren<P> }
> & {
  Renderer: RendererType<P>;
};
export function createSlot<P extends {}>() {
  const Slot: SlotType<P> = (({ children, showChildren, restProps }) => {
    if (!showChildren) {
      return <></>;
    }
    if (typeof children === "function" && restProps) {
      return children(restProps);
    }
    return <>{children}</>;
  }) as SlotType<P>;

  const Renderer: RendererType<P> = ({ childs, children, ...restProps }) => {
    if (childs === undefined) {
      return raw(children);
    }
    if (!Array.isArray(childs)) {
      childs = [childs];
    }
    const slotted = Array.from(childs).find((child) => {
      return isValidElement(child) && child.tag === Slot;
    });

    if (!slotted || !isValidElement(slotted)) {
      return raw(children);
    }
    return raw(
      cloneElement(slotted, {
        restProps: { ...restProps, defaultChildren: children },
        showChildren: true,
      } as unknown as SlotProps<P>),
    );
  };
  Slot.Renderer = Renderer;
  return Slot;
}
