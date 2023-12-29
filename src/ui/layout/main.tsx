//

import type { Child } from "hono/jsx";
import { Root_Layout } from "./root";

//

declare module "hono" {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props?: Main_Layout_Props,
    ): Response | Promise<Response>;
  }
}

interface Main_Layout_Props {
  username: string;
}

//

export function Main_Layout({
  children,
  username,
}: {
  children?: Child;
} & Main_Layout_Props) {
  return (
    <Root_Layout>
      <div class="flex flex-grow flex-col">
        <header role="banner" class="fr-header">
          <div class="fr-header__body">
            <div class="fr-container">
              <div class="fr-header__body-row">
                <Brand />
                <Tools username={username} />
              </div>
            </div>
            {/*  */}
          </div>
        </header>
        <div class="relative flex flex-1 flex-col">{children}</div>
      </div>
    </Root_Layout>
  );
}

function Brand() {
  return (
    <div class="fr-header__brand fr-enlarge-link">
      <div class="fr-header__brand-top">
        <div class="fr-header__logo">
          <p class="fr-logo">
            République
            <br />
            Française
          </p>
        </div>
      </div>
      <div class="fr-header__service">
        <a href="/" title="Accueil ">
          <p class="fr-header__service-title">Hypertool</p>
        </a>
        <p class="fr-header__service-tagline">hyyyyyyyypertool</p>
      </div>
    </div>
  );
}

function Tools({ username }: { username?: string }) {
  return (
    <div class="fr-header__tools">
      <div class="fr-header__tools-links">
        <ul class="fr-btns-group">
          <li>
            <a
              class="fr-btn fr-btn--sm fr-btn--tertiary-no-outline fr-fi-logout-box-r-line fr-btn--icon-left"
              href="/client/logout"
            >
              {username}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
