//

import base_config from "@~/config.tailwindcss";
import { Config } from "tailwindcss";

//

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./packages/~/**/*.{ts,tsx}",
    "./packages/~/app/ui/src/**/*.{ts,tsx}",
    "./packages/~/infra/crisp/ui/src/**/*.{ts,tsx}",
    "./packages/~/moderations/api/src/**/*.{ts,tsx}",
    "./packages/~/moderations/ui/src/**/*.{ts,tsx}",
    "./packages/~/organizations/api/src/**/*.{ts,tsx}",
    "./packages/~/organizations/ui/src/**/*.{ts,tsx}",
    "./packages/~/users/ui/src/**/*.{ts,tsx}",
  ],
  presets: [base_config],
};

export default config;
