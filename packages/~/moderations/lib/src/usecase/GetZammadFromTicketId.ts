//

import { HTTPError } from "@~/app.core/error";
import type { get_zammad_mail } from "@~/zammad.lib/get_zammad_mail";
import { is_zammad_ticket } from "@~/zammad.lib/is_zammad_ticket";
import { to } from "await-to-js";

//

export function GetZammadFromTicketId({
  fetch_zammad_mail,
}: {
  fetch_zammad_mail: typeof get_zammad_mail;
}) {
  return async function get_zammad_from_ticket_id({
    ticket_id,
    limit = 3,
  }: {
    ticket_id: string;
    limit?: number;
  }) {
    if (!is_zammad_ticket(ticket_id)) throw new Error("ticket_id is required");

    const [articles_err, articles] = await to(
      fetch_zammad_mail({ ticket_id: Number(ticket_id) }),
    );
    console.log(articles);
    if (articles_err)
      throw new HTTPError("articles is required", { cause: articles_err });

    return {
      articles,
      show_more: articles.length > limit,
      subject: articles.at(0)?.subject ?? "",
      ticket_id,
    };
  };
}
