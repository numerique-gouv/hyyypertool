//

import { ASSETS_PATH } from ":assets/config";
import { date_to_string } from ":common/date";
import env from ":common/env";
import { type Moderation } from ":database:moncomptepro";
import { quote } from ":ui/quote";
import { GROUP_MONCOMPTEPRO_SENDER_ID } from "@~/zammad.lib/const";
import type { Article } from "@~/zammad.lib/types";
import { tv } from "tailwind-variants";

//

export function Message({
  article,
  moderation,
}: {
  article: Article;
  moderation: Moderation;
}) {
  const is_family = article.sender_id === GROUP_MONCOMPTEPRO_SENDER_ID;
  const { author, base, body, caption, source } = message_variants({
    is_family,
  });
  const created_at = new Date(article.created_at);

  return (
    <figure class={base()}>
      <div
        class={body()}
        dangerouslySetInnerHTML={{
          __html: article.body.replace(
            `src="/api/v1/ticket_attachment`,
            `src="${ASSETS_PATH}/zammad/attachment`,
          ),
        }}
      ></div>
      <figcaption class={caption()}>
        <p class={author()}>{article.subject}</p>
        <p class={author()}>{article.from}</p>
        <ul class={source()}>
          <li>
            Créé le{" "}
            <time
              datetime={date_to_string(created_at)}
              title={article.created_at}
            >
              {date_to_string(created_at)}
            </time>
          </li>
          <li>par {article.created_by}</li>
          <li>
            <a
              href={`${env.ZAMMAD_URL}/#ticket/zoom/${moderation.ticket_id}/${article.id}`}
              rel="noopener noreferrer"
              target="_blank"
              title="Ouvrir le ticket dans Zammad - nouvelle fenêtre"
            >
              Ouvrir
            </a>
          </li>
        </ul>
      </figcaption>
    </figure>
  );
}
//

const message_variants = tv({
  base: `
    [&_blockquote]:border-l-6
    p-6
    pb-0 [&_blockquote]:ml-5
    [&_blockquote]:border-y-0
    [&_blockquote]:border-r-0
    [&_blockquote]:border-solid
    [&_blockquote]:border-l-[--background-contrast-grey-hover]
    [&_blockquote]:p-6
    [&_blockquote_p]:text-base
    [&_blockquote_p]:font-normal
  `,
  extend: quote,
  slots: {
    body: `
      break-words
      border-l-4
      border-gray-400
      pb-6
      !text-base
      [&_*]:!bg-transparent
    `,
    caption: `
      bg-[--background-contrast-grey]
      p-8
    `,
  },
  variants: {
    is_family: {
      true: "ml-12 mr-2 bg-[--background-alt-blue-ecume]",
      false: "ml-2 mr-12 bg-[--background-alt-grey]",
    },
  },
});
