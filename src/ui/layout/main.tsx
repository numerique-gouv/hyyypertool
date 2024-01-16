//

import type { AgentConnect_UserInfo } from ":common/session";
import { api_ref } from ":paths";
import type { Child } from "hono/jsx";
import { Root_Layout, type Root_Layout_Props } from "./root";

//

export interface Main_Layout_Props extends Root_Layout_Props {
  username?: string;
}

//

export function Main_Layout({
  children,
  nonce,
  username,
}: {
  children?: Child;
} & Main_Layout_Props) {
  return (
    <Root_Layout nonce={nonce}>
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

          <div class="fr-header__menu fr-modal">
            <div class="fr-container">
              <Nav />
            </div>
          </div>
        </header>
        <div class="relative flex flex-1 flex-col">{children}</div>
      </div>
    </Root_Layout>
  );
}

export function userinfo_to_username(userinfo: AgentConnect_UserInfo) {
  const { given_name, usual_name } = userinfo;
  return `${given_name} ${usual_name}`;
}

//

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
              href={api_ref("/auth/logout", {})}
            >
              {username}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav
      class="fr-nav"
      id="navigation-494"
      role="navigation"
      aria-label="Menu principal"
    >
      <ul class="fr-nav__list">
        <li class="fr-nav__item">
          <a class="fr-nav__link" href={api_ref("/legacy", {})} target="_self">
            Legacy
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            class="fr-nav__link"
            href={api_ref("/legacy/users", {})}
            target="_self"
          >
            Utilisateurs
          </a>
        </li>
        <li class="fr-nav__item">
          <a
            class="fr-nav__link"
            href={api_ref("/legacy/organizations", {})}
            target="_self"
          >
            Organisations
          </a>
        </li>
      </ul>
    </nav>
  );
}
