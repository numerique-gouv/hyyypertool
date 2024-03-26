/// <reference types="node" />
/// <reference types="bun-types" />
declare const app: import("hono/hono-base").HonoBase<
  {},
  {
    "/organizations/:id/$procedures/verify/:domain": {
      $patch: {
        input: {
          param: {
            id: string;
            domain: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/domains/internal": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
      $put: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
          form: {
            domain: string | File;
          };
        };
        output: {};
      };
      $delete: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/domains/internal/:domain": {
      $delete: {
        input: {
          param: {
            id: string;
            domain: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
      $patch: {
        input: {
          param: {
            id: string;
            domain: string;
          } & {
            id: string;
          };
          form: {
            is_verified?: string | File | undefined;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/domains/external": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
      $put: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
          form: {
            domain: string | File;
          };
        };
        output: {};
      };
      $delete: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/domains/external/:domain": {
      $delete: {
        input: {
          param: {
            id: string;
            domain: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/members/:user_id/$procedures/join": {
      $post: {
        input: {
          form: {
            is_external: string | File;
          };
          param: {
            id: string;
            user_id: string;
          } & {
            user_id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/members/:user_id": {
      $post: {
        input: {
          form: {
            is_external: string | File;
          };
          param: {
            id: string;
            user_id: string;
          } & {
            user_id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
      $patch: {
        input: {
          param: {
            id: string;
            user_id: string;
          } & {
            user_id: string;
          } & {
            id: string;
          };
          form: {
            verification_type?: string | File | undefined;
            is_external?: string | File | undefined;
          };
        };
        output: {};
      };
      $delete: {
        input: {
          param: {
            id: string;
            user_id: string;
          } & {
            user_id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/:id/members": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
          query: {
            describedby: string | string[];
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
          };
        };
        output: {};
      };
    };
    "/organizations/:id": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/organizations/leaders": {
      $get: {
        input: {
          query: {
            siret: string | string[];
          };
        };
        output: {};
      };
    };
    "/organizations": {
      $get: {
        input: {
          query: {
            "search-siret"?: string | string[] | undefined;
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
            id?: string | string[] | undefined;
          };
        };
        output: {};
      };
    };
  } & {
    "/users/:id/moderations": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/users/:id/organizations": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
          query: {
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
          };
        };
        output: {};
      };
    };
    "/users/:id": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
      $delete: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/users/:id/reset": {
      $patch: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/users": {
      $get: {
        input: {
          query: {
            "search-email"?: string | string[] | undefined;
            page?: string | string[] | undefined;
            page_size?: string | string[] | undefined;
            id?: string | string[] | undefined;
          };
        };
        output: {};
      };
    };
  } & {
    "/moderations/:id/$procedures/validate": {
      $patch: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
          form: {
            add_domain?: string | File | undefined;
            add_member?: string | File | undefined;
            send_notitfication?: string | File | undefined;
          };
        };
        output: {};
      };
    };
    "/moderations/:id/$procedures/reprocess": {
      $patch: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/moderations/:id/$procedures/rejected": {
      $patch: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
          form: {
            message: string | File;
            subject: string | File;
          };
        };
        output: {};
      };
    };
    "/moderations/:id/$procedures/processed": {
      $patch: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/moderations/:id/duplicate_warning": {
      $get: {
        input: {
          query: {
            user_id: string | string[];
            organization_id: string | string[];
          };
        } & {
          param: {
            id: string;
          };
        };
        output: {};
      };
    };
    "/moderations/:id/email": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/moderations/:id": {
      $get: {
        input: {
          param: {
            id: string;
          } & {
            id: string;
          };
        };
        output: {};
      };
    };
    "/moderations": {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    "/auth/login": {
      $post: {
        input: {};
        output: {};
      };
    };
    "/auth/fake/login/callback": {
      $get: {
        input: {};
        output: {};
      };
    };
    "/auth/login/callback": {
      $get: {
        input: {
          query: {
            code: string | string[];
            state: string | string[];
          };
        };
        output: {};
      };
    };
    "/auth/logout": {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    "/": {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    "/proxy/localhost:3000/*": {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    "/readyz": {
      $get: {
        input: {};
        output: {};
      };
    };
    "/readyz/zammad": {
      $get: {
        input: {};
        output: {};
      };
    };
    "/readyz/drizzle/moncomptepro": {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    [
      x: `/assets/${string}/zammad/attachment/:ticket_id/:article_id/:attachment_id`
    ]: {
      $get: {
        input: {
          param: {
            article_id: string;
            attachment_id: string;
            ticket_id: string;
          };
        };
        output: {};
      };
    };
    [x: `/assets/${string}/bundle/config.js`]: {
      $get: {
        input: {};
        output: {};
      };
    };
    [x: `/assets/${string}/bundle/env.js`]: {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    "/healthz": {
      $get: {
        input: {};
        output: {};
      };
    };
  } & {
    "/livez": {
      $get: {
        input: {};
        output: {};
      };
    };
  },
  "/"
>;
export type Router = typeof app;
export default app;
