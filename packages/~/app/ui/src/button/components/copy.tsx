//

import type { JSX, PropsWithChildren } from "hono/jsx";
import type { ClassProp, VariantProps } from "tailwind-variants";
import { button } from "..";

//

export function CopyButton(
  props: JSX.IntrinsicElements["button"] &
    PropsWithChildren<{
      text: string;
      variant?: VariantProps<typeof button> & ClassProp;
    }>,
) {
  const { text, class: className, children, variant, ...other_props } = props;
  return (
    <button
      _="
      on click
        set text to @data-text
        js(me, text)
          if ('clipboard' in window.navigator) {
            navigator.clipboard.writeText(text)
          }
        end"
      class={button(variant)}
      data-text={text}
      {...other_props}
    >
      📋 {children}
    </button>
  );
}
