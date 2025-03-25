//

import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import { CopyButton } from "@~/app.ui/button/components/copy";
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
      <div class="max-w-md border border-gray-300 bg-white">
        <div class="grid grid-cols-[auto_1px_auto] items-center gap-4">
          <div class="flex flex-col gap-3 text-gray-700">
            <div>EMAIL</div>
            <div>DOMAINE MAIL</div>
            <div>PRÉNOM</div>
            <div>NOM</div>
            <div>NUMÉRO</div>
            <div>PROFESSION</div>
          </div>

          <div class="h-full w-[1px] bg-gray-400"></div>

          <div class="flex flex-col gap-3 font-medium text-gray-900">
            <div>
              {user.email}
              <CopyButton
                text={user.email}
                variant={{ size: "sm", type: "tertiary" }}
              ></CopyButton>
            </div>
            <div>
              {domain}
              <CopyButton
                text={domain}
                variant={{ size: "sm", type: "tertiary" }}
              ></CopyButton>
            </div>
            <div>{user.given_name}</div>
            <div>{user.family_name}</div>
            <div>{user.phone_number}</div>
            <div>{user.job}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
