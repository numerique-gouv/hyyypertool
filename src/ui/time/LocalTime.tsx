//

import { date_to_string } from ":common/date";

//

export function LocalTime({
  date: date_like,
}: {
  date: Date | string | null | undefined;
}) {
  if (!date_like) return <></>;

  const date = new Date(date_like);

  return (
    <time datetime={date?.toISOString()} title={date?.toString()}>
      {date_to_string(date)}
    </time>
  );
}
