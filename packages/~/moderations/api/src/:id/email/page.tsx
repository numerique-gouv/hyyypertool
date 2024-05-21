//

import { callout } from "@~/app.ui/callout";
import { LocalTime } from "@~/app.ui/time/LocalTime";
import { OpenInZammad } from "@~/app.ui/zammad/components/OpenInZammad";
import { get_zammad_mail } from "@~/zammad.lib";
import { useContext, type PropsWithChildren } from "hono/jsx";
import { Message } from "./Message";
import { List_Context, Moderation_Context } from "./context";

//
export const MAX_ARTICLE_COUNT = 3;

//

export default async function Page() {
  return (
    <ListProvider>
      <section>
        <Header />
        <List />
      </section>
    </ListProvider>
  );
}

function List() {
  const { articles } = useContext(List_Context);
  return (
    <ul class="list-none">
      <ShowMore />
      {articles.map((article, index) => (
        <li
          class={index === articles.length - 1 ? "last-message" : ""}
          id={`${article.id}`}
          key={`${article.id}`}
        >
          <p class="text-center text-sm font-bold">
            <LocalTime date={article.created_at} />
          </p>
          <Message article={article} />
          <hr />
        </li>
      ))}
    </ul>
  );
}

function ShowMore() {
  const { show_more, ticket_id } = useContext(List_Context);

  if (!show_more) return <></>;

  return (
    <li class="my-12 text-center">
      <ShowMoreCallout ticket_id={ticket_id}></ShowMoreCallout>
    </li>
  );
}

function Header() {
  const { subject, ticket_id } = useContext(List_Context);
  return (
    <h5 class="flex flex-row justify-between">
      <span>{subject}</span>
      <OpenInZammad ticket_id={ticket_id}> #{ticket_id} </OpenInZammad>
    </h5>
  );
}

async function ListProvider({ children }: PropsWithChildren) {
  const {
    moderation: { ticket_id },
  } = useContext(Moderation_Context);
  if (!ticket_id) {
    return <FindCorrespondingEmail />;
  }

  const zammad_articles = await get_zammad_mail({
    ticket_id,
  });
  const show_more = zammad_articles.length > MAX_ARTICLE_COUNT;
  const articles = zammad_articles.slice(-MAX_ARTICLE_COUNT);
  const subject = zammad_articles.at(0)?.subject ?? "";
  return (
    <List_Context.Provider value={{ subject, show_more, articles, ticket_id }}>
      {children}
    </List_Context.Provider>
  );
}

function FindCorrespondingEmail() {
  const { moderation } = useContext(Moderation_Context);
  return (
    <div class="m-auto my-12 w-fit">
      <a
        href={`https://support.etalab.gouv.fr/#search/${moderation.user.email}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Trouver l'email correspondant dans Zammad
      </a>
    </div>
  );
}

function ShowMoreCallout({ ticket_id }: { ticket_id: number }) {
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {MAX_ARTICLE_COUNT} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Zammad{" "}
        <OpenInZammad ticket_id={ticket_id}>#{ticket_id}</OpenInZammad>
      </p>
    </div>
  );
}
