import { JSXNode, type Child, type FC } from "hono/jsx";

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
  const Slot: SlotType<P> = (({ children, showChildren, restProps }) => {
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
      return child instanceof JSXNode && child.tag === Slot;
    });

    if (!slotted || !(slotted instanceof JSXNode)) {
      return <>{children}</>;
    }

    // TODO(dougladuteil): this is a hack to make sure typescript is happy
    // This is not working as expected, but it's not a big deal for now
    return <>{new JSXNode(slotted.tag, restProps, children as Child[])}</>;
  };

  Slot.Renderer = Renderer;

  return Slot;
}
