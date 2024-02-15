//

import type { Child } from "hono/jsx";

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
      class="fr-link"
      href={google_search(query)}
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
