//

import config from "@~/app.core/config";
import type { Child } from "hono/jsx";

//

/**
 *
 * @example
 * ```tsx
 * <OpenInZammad ticket_id={moderation.ticket_id}>
 *   #{moderation.ticket_id}
 * </OpenInZammad>
 * ```
 */
export function OpenInZammad({
  children,
  ticket_id,
}: {
  children: Child;
  ticket_id: number;
}) {
  return (
    <a
      href={`${config.ZAMMAD_URL}/#ticket/zoom/${ticket_id}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}

export function SearchInZammad({
  children,
  search,
}: {
  children: Child;
  search: string;
}) {
  return (
    <a
      href={`${config.ZAMMAD_URL}/#search/${search}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {children}
    </a>
  );
}
