//

import { callout } from "@~/app.ui/callout";
import { OpenInCrisp, short_session_id } from "@~/app.ui/links/OpenInCrisp";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { Message } from "@~/crisp.ui/message";
import { match } from "ts-pattern";
import { usePageRequestContext } from "./context";

//

export default async function Crisp() {
  return (
    <section>
      <Header />
      <List />
    </section>
  );
}

//

function Header() {
  const {
    var: { crisp, crisp_config },
  } = usePageRequestContext();
  const { subject, session_id } = crisp!;
  return (
    <h5 class="flex flex-row justify-between">
      <span>{subject}</span>
      <OpenInCrisp session_id={session_id} website_id={crisp_config.website_id}>
        #{short_session_id(session_id)}
      </OpenInCrisp>
    </h5>
  );
}

function List() {
  const {
    var: { crisp },
  } = usePageRequestContext();
  const { messages } = crisp!;
  return (
    <ul class="list-none">
      <ShowMore />
      {messages.map((message, index) => (
        <li
          class={index === messages.length - 1 ? "last-message" : ""}
          id={`${message.fingerprint}`}
          key={`${message.fingerprint}`}
        >
          {match(message.type)
            .with("text", () => (
              <>
                <p class="text-center text-sm font-bold">
                  <LocalTime date={new Date(message.timestamp)} />
                </p>
                <Message messsage={message} />
                <hr />
              </>
            ))
            .otherwise(() => (
              <>[...]</>
            ))}
        </li>
      ))}
    </ul>
  );
}

function ShowMore() {
  const {
    var: { crisp },
  } = usePageRequestContext();
  const { show_more, session_id } = crisp!;

  if (!show_more) return <></>;

  return (
    <li class="my-12 text-center">
      <ShowMoreCallout session_id={session_id} />
    </li>
  );
}

function ShowMoreCallout({ session_id }: { session_id: string }) {
  const {
    var: {
      config: { CRISP_WEBSITE_ID },
      MAX_ARTICLE_COUNT,
    },
  } = usePageRequestContext();
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {MAX_ARTICLE_COUNT} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Crisp{" "}
        <OpenInCrisp session_id={session_id} website_id={CRISP_WEBSITE_ID}>
          #{short_session_id(session_id)}
        </OpenInCrisp>
      </p>
    </div>
  );
}
