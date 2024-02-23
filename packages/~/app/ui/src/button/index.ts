//

import { tv, type VariantProps } from "tailwind-variants";

//

export const button = tv({
  base: "fr-btn",
  variants: {
    intent: {
      danger: "bg-[--error-425-625] hover:!bg-[--error-425-625-hover]",
      dark: "bg-[--grey-0-1000] hover:!bg-[--grey-200-850]",
      success:
        "bg-[--background-action-high-green-bourgeon] hover:enabled:!bg-[--background-action-high-green-bourgeon-hover]",
      warning: "bg-[--warning-425-625] hover:!bg-[--warning-425-625-hover]",
    },
    size: {
      sm: "fr-btn--sm",
      lg: "fr-btn--lg",
    },
    type: {
      tertiary: "fr-btn--tertiary",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;
