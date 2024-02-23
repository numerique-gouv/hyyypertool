//

import { tv } from "tailwind-variants";

//

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
