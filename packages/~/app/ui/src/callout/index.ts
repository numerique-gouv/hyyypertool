//

import { tv } from "tailwind-variants";

//

/**
 * @example
 * ```tsx
 * function MyCallout() {
 *   const { base, text, title } = callout();
 *   return (
 *     <div class={base()}>
 *       <p class={title()}>Coucou</p>
 *       <p class={text()}>
 *         Jean Pierre
 *       </p>
 *     </div>
 *   );
 * }
 * ```
 */
export const callout = tv({
  base: `
    fr-callout
    fr-icon-information-line
  `,
  slots: {
    title: "fr-callout__title",
    text: "fr-callout__text",
  },
  variants: {
    intent: {
      success: {
        base: "fr-callout--green-emeraude",
      },
      warning: {
        base: "fr-callout--brown-caramel",
      },
    },
  },
});
