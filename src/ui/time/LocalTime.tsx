//

import { date_to_string } from ":common/date";

//

export function LocalTime({ date }: { date: Date | null | undefined }) {
  return (
    <time datetime={date?.toISOString()} title={date?.toString()}>
      {date_to_string(date)}
    </time>
  );
}
