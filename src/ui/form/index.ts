//

import { tv } from "tailwind-variants";

//

export const input_group = tv({
  base: `
    fr-input-group
  `,
  slots: {
    hint: "fr-hint-text",
    input: "fr-input",
    label: "fr-label",
    text: "",
  },
  variants: {
    validation_state: {
      success: {
        base: "fr-input-group--valid",
        input: "fr-input--valid",
        text: "fr-valid-text",
      },
      error: {
        base: "fr-input-group--error",
        input: "fr-input--error",
        text: "fr-error-text",
      },
    },
  },
});
