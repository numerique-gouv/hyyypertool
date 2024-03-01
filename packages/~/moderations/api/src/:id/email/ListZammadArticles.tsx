//

import { date_to_string } from "@~/app.core/date/date_format";
import { callout } from "@~/app.ui/callout";
import { OpenInZammad } from "@~/app.ui/zammad/components/OpenInZammad";
import { type Moderation, type User } from "@~/moncomptepro.database";
import { get_zammad_mail } from "@~/zammad.lib";
import { Message } from "./Message";

//
export const MAX_ARTICLE_COUNT = 3;

//

export async function ListZammadArticles({
  moderation,
}: {
  moderation: Moderation & { users: User };
}) {
  if (!moderation.ticket_id) {
    return (
      <div class="m-auto my-12 w-fit">
        <a
          href={`https://support.etalab.gouv.fr/#search/${moderation.users.email}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          Trouver l'email correspondant dans Zammad
        </a>
      </div>
    );
  }

  const articles = await get_zammad_mail({ ticket_id: moderation.ticket_id });
  const show_more = articles.length > MAX_ARTICLE_COUNT;
  const displayed_articles = articles.slice(-MAX_ARTICLE_COUNT);

  return (
    <section>
      <h5 class="flex flex-row justify-between">
        <span>{articles.at(0)?.subject}</span>
        <OpenInZammad ticket_id={moderation.ticket_id}>
          #{moderation.ticket_id}
        </OpenInZammad>
      </h5>
      <ul class="list-none">
        {show_more ? (
          <li class="my-12 text-center">
            <ShowMoreCallout ticket_id={moderation.ticket_id}></ShowMoreCallout>
          </li>
        ) : (
          <></>
        )}
        {displayed_articles.map((article, index) => (
          <li
            class={
              index === displayed_articles.length - 1 ? "last-message" : ""
            }
            id={`${article.id}`}
          >
            <p class="text-center text-sm font-bold">
              <time datetime={article.created_at} title={article.created_at}>
                {date_to_string(new Date(article.created_at))}
              </time>
            </p>
            <Message article={article} moderation={moderation} />
            <hr />
          </li>
        ))}
        <li>
          <hr />
        </li>
      </ul>
    </section>
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
