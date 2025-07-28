//

import base_config from "@~/config.tailwindcss";
import { Config } from "tailwindcss";

//

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./sources/**/*.{ts,tsx}",
    "./sources/app/ui/src/**/*.{ts,tsx}",
    "./sources/infra/crisp/ui/src/**/*.{ts,tsx}",
    "./sources/moderations/api/src/**/*.{ts,tsx}",
    "./sources/moderations/ui/src/**/*.{ts,tsx}",
    "./sources/organizations/api/src/**/*.{ts,tsx}",
    "./sources/organizations/ui/src/**/*.{ts,tsx}",
    "./sources/users/api/src/**/*.{ts,tsx}",
    "./sources/users/ui/src/**/*.{ts,tsx}",
  ],
  presets: [base_config],
};

export default config;
