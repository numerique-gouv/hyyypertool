//

import tailwindcss_typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";

//

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}", "./packages/~/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindcss_typography,
    plugin(function htmx({ addVariant }) {
      // from https://www.crocodile.dev/blog/css-transitions-with-tailwind-and-htmx
      addVariant("htmx-settling", ["&.htmx-settling", ".htmx-settling &"]);
      addVariant("htmx-request", ["&.htmx-request", ".htmx-request &"]);
      addVariant("htmx-swapping", ["&.htmx-swapping", ".htmx-swapping &"]);
      addVariant("htmx-added", ["&.htmx-added", ".htmx-added &"]);
    }),
  ],
};
