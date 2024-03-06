//

import base_config from "@~/config.tailwindcss";
import type { Config } from "tailwindcss";

//

const config: Pick<Config, "content" | "presets"> = {
  content: ["./src/**/*.{ts,tsx}"],
  presets: [base_config],
};

export default config;
