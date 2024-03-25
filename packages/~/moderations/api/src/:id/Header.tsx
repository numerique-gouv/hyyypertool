//

import { button } from "@~/app.ui/button";
import { callout } from "@~/app.ui/callout";
import { notice } from "@~/app.ui/notice";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { hx_urls } from "@~/app.urls";
import { moderation_type_to_emoji } from "@~/moderations.lib/moderation_type.mapper";
import type { Moderation } from "@~/moncomptepro.database";
import { raw } from "hono/html";
import { useContext } from "hono/jsx";
import { MessageInfo } from "./MessageInfo";
import { ModerationPage_Context } from "./context";

//

export function Header() {
  const { moderation } = useContext(ModerationPage_Context);
  return (
    <header>
      <section class="flex items-baseline space-x-5">
        <h1>
          <span>
            {moderation_type_to_emoji(moderation.type)}{" "}
            {moderation.users.given_name} {moderation.users.family_name}
          </span>
        </h1>
        <div>
          <State_Badge />
        </div>
      </section>

      <hr class="bg-none" />

      <ModerationCallout moderation={moderation} />

      <hr class="bg-none" />

      <Info />

      <hr class="bg-none" />

      <Comments />

      <hr class="bg-none" />

      <div
        {...hx_urls.moderations[":id"].duplicate_warning.$get({
          param: {
            id: moderation.id.toString(),
          },
          query: {
            organization_id: moderation.organization_id.toString(),
            user_id: moderation.user_id.toString(),
          },
        })}
        hx-trigger="load"
      >
        Demande multiples ?
      </div>
    </header>
  );
}

function State_Badge() {
  const { moderation } = useContext(ModerationPage_Context);
  const is_treated = moderation.moderated_at !== null;
  if (is_treated) return <p class="fr-badge fr-badge--success">Traité</p>;
  return <p class="fr-badge fr-badge--new">A traiter</p>;
}

function Info() {
  const { base, container, body, title } = notice({ type: "info" });
  return (
    <div class={base()}>
      <div class={container()}>
        <div class={body()}>
          <p class={title()}>
            <MessageInfo />
          </p>
        </div>
      </div>
    </div>
  );
}

function ModerationCallout({ moderation }: { moderation: Moderation }) {
  if (!moderation.moderated_at) return raw``;

  const { base, text, title } = callout({ intent: "success" });
  return (
    <div class={base()}>
      <h3 class={text()}>Modération traitée</h3>
      <p class={title()}>
        Cette modération a été marqué comme traitée le{" "}
        <b>
          <LocalTime date={moderation.moderated_at} />
        </b>
        {moderation.moderated_by ? (
          <>
            {" "}
            par <b>{moderation.moderated_by}</b>
          </>
        ) : (
          raw``
        )}
        .
      </p>
      <LastComment />
      <button
        class={button({ size: "sm", type: "tertiary" })}
        {...hx_urls.moderations[":id"].$procedures.reprocess.$patch({
          param: { id: moderation.id.toString() },
        })}
        hx-swap="none"
      >
        Retraiter
      </button>
    </div>
  );
}

function LastComment() {
  const {
    moderation: { comment },
  } = useContext(ModerationPage_Context);
  if (!comment) {
    return raw``;
  }
  const parsed_comment = parse_comment(comment);
  const last_comment = parsed_comment.at(-1);
  return <p>{last_comment?.value}</p>;
}

function Comments() {
  const {
    moderation: { comment },
  } = useContext(ModerationPage_Context);
  const parsed_comment = parse_comment(comment);
  return (
    <details>
      <summary>Commentaires</summary>

      <ul class="ml-4">
        {parsed_comment.map(({ created_at, created_by, value }) => (
          <li key={created_at}>
            <b>{created_by}</b>{" "}
            <small>
              <LocalTime date={created_at} />
            </small>
            <br /> {value}
          </li>
        ))}
      </ul>
    </details>
  );
}

function parse_comment(comment: string | null) {
  if (!comment) return [];
  return comment.split("\n").map((line) => {
    const [when_and_by, value] = line.split(" | ");
    const [created_at, created_by] = when_and_by.split(" ");
    return { created_at: new Date(Number(created_at)), created_by, value };
  });
}
