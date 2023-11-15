//

import { html } from "@elysiajs/html";
import Elysia from "elysia";

export const www = new Elysia().use(html());
export type ElysiaWWW = typeof www;
