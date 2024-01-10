//

import type { Child } from "hono/jsx";
import { button } from ".";

//

export function CopyButton({
  text,
  children,
}: {
  text: string;
  children?: Child;
}) {
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
      class={button()}
      data-text={text}
    >
      📋 {children}
    </button>
  );
}
