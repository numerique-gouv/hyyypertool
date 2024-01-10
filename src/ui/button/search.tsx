//

import type { Child } from "hono/jsx";
import { button } from ".";

//

export function GoogleSearchButton({
  query,
  children,
}: {
  query: string;
  children?: Child;
}) {
  return (
    <a
      href={google_search(query)}
      class={button()}
      rel="noopener noreferrer"
      target="_blank"
    >
      🔍 {children}
    </a>
  );
}

//

function google_search(q: string) {
  const query = new URLSearchParams({ q });
  return `https://www.google.com/search?${query}`;
}
