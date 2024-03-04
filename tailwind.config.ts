//

import base_config from "@~/config.tailwindcss";
import { Config } from "tailwindcss";

//

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/**/*.{ts,tsx}", "./packages/~/**/*.{ts,tsx}"],
  presets: [base_config],
};

export default config;
