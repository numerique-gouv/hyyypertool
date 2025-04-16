//

import type { JSX, PropsWithChildren } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { button } from "..";

//

export function CopyButton(
  props: JSX.IntrinsicElements["button"] &
    PropsWithChildren<{
      text: string;
      variant?: VariantProps<typeof button>;
    }>,
) {
  const { children, class: className, text, variant, ...other_props } = props;

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
      class={copy_button_style({
        ...variant,
        className: String(className),
        intent: "ghost",
      })}
      data-text={text}
      {...other_props}
    >
      <span class="fr-icon-clipboard-line" aria-hidden="true"></span>
      {children}
    </button>
  );
}

const copy_button_style = tv({
  base: "text-[--text-action-high-blue-france]",
  extend: button,
});
