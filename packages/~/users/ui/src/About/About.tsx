//

import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { CopyButton } from "@~/app.ui/button/components/copy";
import { description_list } from "@~/app.ui/list";
import { urls } from "@~/app.urls";
import type { GetUserInfoOutput } from "@~/users.lib/usecase/GetUserInfo";

//

type AboutProps = {
  user: GetUserInfoOutput;
};

//

export function About({ user }: AboutProps) {
  const domain = z_email_domain.parse(user.email, { path: ["user.email"] });

  return (
    <section>
      <h3>
        <a
          class="bg-none"
          target="_blank"
          href={
            urls.users[":id"].$url({ param: { id: user.id.toString() } })
              .pathname
          }
        >
          👨‍💻 Profile
        </a>
      </h3>
      <dl class={description_list()}>
        <dt>Email </dt>
        <dd>
          {user.email}{" "}
          <CopyButton
            class="ml-2"
            text={user.email}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>Domaine email </dt>
        <dd>
          {domain}{" "}
          <CopyButton
            class="ml-2"
            text={domain}
            variant={{ size: "sm", type: "tertiary" }}
          ></CopyButton>
        </dd>

        <dt>Prénom </dt>
        <dd>{user.given_name}</dd>

        <dt>Nom </dt>
        <dd>{user.family_name}</dd>

        <dt>Numéro de téléphone </dt>
        <dd>{user.phone_number}</dd>

        <dt>Profession </dt>
        <dd>{user.job}</dd>
      </dl>
    </section>
  );
}
