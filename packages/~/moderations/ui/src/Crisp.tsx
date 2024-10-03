//

import { callout } from "@~/app.ui/callout";
import { OpenInCrisp, short_session_id } from "@~/app.ui/links/OpenInCrisp";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import type { Config } from "@~/crisp.lib/types";
import { Message } from "@~/crisp.ui/message";
import type { get_crisp_from_session_id } from "@~/moderations.lib/usecase/GetCripsFromSessionId";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";

//

interface Values {
  crisp_config: Config;
  limit: number;
  crisp: Awaited<ReturnType<get_crisp_from_session_id>>;
}
const context = createContext<Values>(null as any);

//

export default async function Crisp() {
  const { describedby } = { describedby: "" };

  return (
    <section aria-describedby={describedby}>
      <Header />
      <List />
    </section>
  );
}
Crisp.Provider = context.Provider;

//

function Header() {
  const { crisp, crisp_config } = useContext(context);
  const { subject, session_id } = crisp;
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
  const { crisp } = useContext(context);
  const { messages } = crisp;
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
  const { crisp } = useContext(context);
  const { show_more, session_id } = crisp;

  if (!show_more) return <></>;

  return (
    <li class="my-12 text-center">
      <ShowMoreCallout session_id={session_id} />
    </li>
  );
}

function ShowMoreCallout({ session_id }: { session_id: string }) {
  const {
    crisp_config: { website_id },
    limit,
  } = useContext(context);
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {limit} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Crisp{" "}
        <pre>{JSON.stringify({ session_id, website_id }, null, 2)}</pre>
        <OpenInCrisp session_id={session_id} website_id={website_id}>
          #{short_session_id(session_id)}
        </OpenInCrisp>
      </p>
    </div>
  );
}
