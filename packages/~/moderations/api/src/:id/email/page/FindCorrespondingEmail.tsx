//

import { usePageRequestContext } from "./context";

//

export function FindCorrespondingEmail() {
  const {
    req,
    var: {
      config: { CRISP_WEBSITE_ID },
      moderation: {
        user: { email },
      },
    },
  } = usePageRequestContext();
  const { describedby } = req.valid("query");

  return (
    <div
      aria-describedby={describedby}
      class="m-auto my-12 flex justify-around"
    >
      <a
        href={`https://support.etalab.gouv.fr/#search/${email}`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Trouver l'email correspondant dans Zammad
      </a>
      <a
        href={`https://app.crisp.chat/website/${CRISP_WEBSITE_ID}/inbox/`}
        rel="noopener noreferrer"
        target="_blank"
      >
        Trouver l'email correspondant dans Crisp
      </a>
    </div>
  );
}
