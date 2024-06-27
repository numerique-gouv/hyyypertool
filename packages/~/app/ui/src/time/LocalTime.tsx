//

import { date_to_string } from "@~/app.core/date/date_format";
import type { PropsWithChildren } from "hono/jsx";

//

interface Time_Props {
  date: Date | string | null | undefined;
}

//

export function Time({
  children,
  date: date_like,
}: PropsWithChildren<Time_Props>) {
  if (!date_like) return <></>;

  const date = new Date(date_like);

  return (
    <time datetime={date.toISOString()} title={date.toString()}>
      {children}
    </time>
  );
}

export function LocalTime({ date: date_like }: Time_Props) {
  if (!date_like) return <></>;

  const date = new Date(date_like);

  return <Time date={date}>{date_to_string(date)}</Time>;
}
