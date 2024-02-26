//

import type { PropsWithChildren } from "hono/jsx";

//

export function GoogleSearchButton({
  query,
  children,
}: PropsWithChildren<{
  query: string;
}>) {
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
