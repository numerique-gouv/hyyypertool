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
  const { text, class: className, variant, ...other_props } = props;
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
      class="text-[--text-action-high-blue-france]"
      data-text={text}
      {...other_props}
    >
      <span class="fr-icon-clipboard-line" aria-hidden="true"></span>
    </button>
  );
}
