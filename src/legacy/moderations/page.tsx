//

import { _02 } from "./02";
import { _03 } from "./03";
import { _04 } from "./04";

export function ModerationPage({
  active_id,
}: {
  active_id: number | undefined;
}) {
  if (!active_id) return <section id="moderation"></section>;
  return (
    <section id="moderation">
      <_02 moderation_id={active_id} />
      <hr />
      <_03 moderation_id={active_id} />
      <hr />
      <_04 moderation_id={active_id} />
    </section>
  );
}
