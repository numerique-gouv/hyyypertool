//
// Inspired by https://github.com/andrey-skl/react-slotify
//

import {
  cloneElement,
  isValidElement,
  type Child,
  type FC,
  type JSXNode,
} from "hono/jsx";

//

interface RendererProps {
  childs: Child;
  children?: Child;
}

type RendererType<P> = FC<RendererProps & P>;

type SlotProps<P> = {
  showChildren?: boolean;
  restProps?: P & { defaultChildren: JSXNode };
};

type NormalOrFunctionChildren<P> =
  | Child
  | ((props: P & { defaultChildren: JSXNode }) => JSXNode);

type SlotType<P> = {
  (
    props: SlotProps<P> & { children?: NormalOrFunctionChildren<P> },
  ): Element | null;
  Renderer: RendererType<P>;
};

export function createSlot<P extends {}>(): SlotType<P> {
  const Slot = (({ children, showChildren, restProps }) => {
    if (!showChildren) {
      return null;
    }
    if (typeof children === "function" && restProps) {
      return children(restProps);
    }
    return <>{children}</>;
  }) as SlotType<P>;

  const Renderer: RendererType<P> = ({ childs, children, ...restProps }) => {
    if (!Array.isArray(childs)) {
      childs = [childs];
    }

    const slotted = childs.find((child) => {
      return isValidElement(child) && child.tag === Slot;
    });

    if (!slotted || !isValidElement(slotted)) {
      return <>{children}</>;
    }

    return (
      <>
        {cloneElement(
          slotted,
          { showChildren: true, restProps },
          children as Child[],
        )}
      </>
    );
  };

  Slot.Renderer = Renderer;

  return Slot;
}
