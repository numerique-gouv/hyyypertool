//

import base_config from "@~/config.tailwindcss";
import { Config } from "tailwindcss";

//

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./modules/**/*.{ts,tsx}",
    "./modules/app/ui/src/**/*.{ts,tsx}",
    "./modules/infra/crisp/ui/src/**/*.{ts,tsx}",
    "./modules/moderations/api/src/**/*.{ts,tsx}",
    "./modules/moderations/ui/src/**/*.{ts,tsx}",
    "./modules/organizations/api/src/**/*.{ts,tsx}",
    "./modules/organizations/ui/src/**/*.{ts,tsx}",
    "./modules/users/api/src/**/*.{ts,tsx}",
    "./modules/users/ui/src/**/*.{ts,tsx}",
  ],
  presets: [base_config],
};

export default config;
