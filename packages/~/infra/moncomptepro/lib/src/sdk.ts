//

import type Pg from "pg";
import type { MCP_EmailDomain_Type } from "./moncomptepro";

//
//
//

// HACK(douglasduteil): disable typescript check on @numerique-gouv/moncomptepro
//
// As the @numerique-gouv/moncomptepro/database is not yet published as a standalone package
// we need to disable the typescript check on it to avoid many typescript errors
//

const MONCOMPTEPRO_MODULE = "@numerique-gouv/moncomptepro";

// import "@numerique-gouv/moncomptepro/src/connectors/postgres";
const POSTGRES_CONNECTOR_MODULE: {
  setDatabaseConnection(newPool: Pg.Pool): void;
} = await import(`${MONCOMPTEPRO_MODULE}/src/connectors/postgres`);

// import "@numerique-gouv/moncomptepro/src/managers/organization/main";
const ORGANIZATION_MANAGER_MODULE: {
  markDomainAsVerified(options: {
    organization_id: number;
    domain: string;
    domain_verification_type: MCP_EmailDomain_Type;
  }): Promise<void>;
} = await import(`${MONCOMPTEPRO_MODULE}/src/managers/organization/main`);

//
//
//

export const setDatabaseConnection =
  POSTGRES_CONNECTOR_MODULE.setDatabaseConnection;
export const markDomainAsVerified =
  ORGANIZATION_MANAGER_MODULE.markDomainAsVerified;
