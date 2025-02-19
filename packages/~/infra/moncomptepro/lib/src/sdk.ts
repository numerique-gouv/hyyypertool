//

import {
  forceJoinOrganizationFactory,
  markDomainAsVerifiedFactory,
} from "@gouvfr-lasuite/proconnect.identite/managers/organization";
import * as EmailDomainRepository from "@gouvfr-lasuite/proconnect.identite/repositories/email-domain";
import * as OrganizationRepository from "@gouvfr-lasuite/proconnect.identite/repositories/organization";
import * as UserRepository from "@gouvfr-lasuite/proconnect.identite/repositories/user";
import type Pg from "pg";

//

export function ForceJoinOrganization(client: Pg.Pool) {
  return forceJoinOrganizationFactory({
    findById: OrganizationRepository.findByIdFactory({ pg: client }),
    findEmailDomainsByOrganizationId:
      EmailDomainRepository.findEmailDomainsByOrganizationIdFactory({
        pg: client,
      }),
    findUserById: UserRepository.findByIdFactory({ pg: client }),
    linkUserToOrganization:
      OrganizationRepository.linkUserToOrganizationFactory({ pg: client }),
  });
}

export type ForceJoinOrganizationHandler = ReturnType<
  typeof ForceJoinOrganization
>;

//

export function MarkDomainAsVerified(client: Pg.Pool) {
  return markDomainAsVerifiedFactory({
    addDomain: EmailDomainRepository.addDomainFactory({ pg: client }),
    findEmailDomainsByOrganizationId:
      EmailDomainRepository.findEmailDomainsByOrganizationIdFactory({
        pg: client,
      }),
    findOrganizationById: OrganizationRepository.findByIdFactory({
      pg: client,
    }),
    getUsers: OrganizationRepository.getUsersByOrganizationFactory({
      pg: client,
    }),
    updateUserOrganizationLink:
      UserRepository.updateUserOrganizationLinkFactory({
        pg: client,
      }),
  });
}

export type MarkDomainAsVerifiedHandler = ReturnType<
  typeof MarkDomainAsVerified
>;
