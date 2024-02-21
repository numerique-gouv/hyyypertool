declare const app: import("hono/hono-base").HonoBase<
  import("hono").Env,
  import("hono/types").MergeSchemaPath<
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono/types").MergeSchemaPath<
          import("hono").ToSchema<
            "get",
            "/:id/moderations",
            {
              param: {
                id: string;
              };
            },
            {}
          >,
          ""
        >,
        "/legacy/users"
      > &
        import("hono/types").MergeSchemaPath<
          import("hono/types").MergeSchemaPath<
            import("hono/types").MergeSchemaPath<
              import("hono/types").MergeSchemaPath<
                import("hono").ToSchema<
                  "get",
                  "/",
                  {
                    param: {
                      id: string;
                    };
                  },
                  {}
                > &
                  import("hono").ToSchema<
                    "put",
                    "/",
                    {
                      param: {
                        id: string;
                      };
                    } & {
                      form: {
                        domain: string;
                      };
                    },
                    {}
                  > &
                  import("hono").ToSchema<
                    "delete",
                    "/:domain",
                    {
                      param: {
                        id: string;
                        domain: string;
                      };
                    },
                    {}
                  > &
                  import("hono").ToSchema<
                    "patch",
                    "/:domain",
                    {
                      param: {
                        id: string;
                        domain: string;
                      };
                    } & {
                      form: {
                        is_verified?: string | undefined;
                      };
                    },
                    {}
                  >,
                "/internal"
              > &
                import("hono/types").MergeSchemaPath<
                  import("hono").ToSchema<
                    "get",
                    "/",
                    {
                      param: {
                        id: string;
                      };
                    },
                    {}
                  > &
                    import("hono").ToSchema<
                      "put",
                      "/",
                      {
                        param: {
                          id: string;
                        };
                      } & {
                        form: {
                          domain: string;
                        };
                      },
                      {}
                    > &
                    import("hono").ToSchema<
                      "delete",
                      "/:domain",
                      {
                        param: {
                          id: string;
                          domain: string;
                        };
                      },
                      {}
                    >,
                  "/external"
                >,
              "domains"
            > &
              import("hono/types").MergeSchemaPath<
                import("hono/types").MergeSchemaPath<
                  import("hono").ToSchema<
                    "post",
                    "/",
                    {
                      form: {
                        is_external: string;
                      };
                    } & {
                      param: {
                        id: string;
                        user_id: string;
                      };
                    },
                    {}
                  > &
                    import("hono").ToSchema<
                      "patch",
                      "/",
                      {
                        param: {
                          id: string;
                          user_id: string;
                        };
                      } & {
                        form: {
                          verification_type?:
                            | ""
                            | "code_sent_to_official_contact_email"
                            | "in_liste_dirigeants_rna"
                            | "official_contact_domain"
                            | "official_contact_email"
                            | "verified_email_domain"
                            | undefined;
                          is_external?: string | undefined;
                        };
                      },
                      {}
                    > &
                    import("hono").ToSchema<
                      "delete",
                      "/",
                      {
                        param: {
                          id: string;
                          user_id: string;
                        };
                      },
                      {}
                    >,
                  "/:user_id"
                > &
                  import("hono").ToSchema<
                    "get",
                    "/",
                    {
                      param: {
                        id: string;
                      };
                    } & {
                      query: {
                        page?: string | undefined;
                        page_size?: string | undefined;
                      };
                    },
                    {}
                  >,
                "members"
              > &
              import("hono/types").MergeSchemaPath<
                import("hono").ToSchema<
                  "get",
                  "/",
                  {
                    param: {
                      id: string;
                    };
                  },
                  {}
                >,
                ""
              > &
              import("hono").ToSchema<
                "patch",
                "verify/:domain",
                {
                  param: {
                    id: string;
                    domain: string;
                  };
                },
                {}
              >,
            "/:id"
          > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "get",
                "/",
                {
                  query: {
                    siret: string;
                  };
                },
                {}
              >,
              "/leaders"
            > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "get",
                "/",
                {
                  query: {
                    page?: string | undefined;
                    page_size?: string | undefined;
                    "search-siret"?: string | undefined;
                    id?: string | undefined;
                  };
                },
                {}
              >,
              ""
            >,
          "/legacy/organizations"
        > &
        import("hono/types").MergeSchemaPath<
          import("hono/types").MergeSchemaPath<
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "get",
                "/",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              > &
                import("hono").ToSchema<
                  "put",
                  "/",
                  {
                    param: {
                      id: string;
                    };
                  } & {
                    form: {
                      "mail-subject": string;
                      response: string;
                    };
                  },
                  {}
                >,
              "/email"
            > &
              import("hono/types").MergeSchemaPath<
                import("hono").ToSchema<
                  "get",
                  "/",
                  {
                    param: {
                      id: string;
                    };
                  },
                  {}
                >,
                ""
              > &
              import("hono").ToSchema<
                "patch",
                "/rejected",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "patch",
                "/processed",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              > &
              import("hono").ToSchema<
                "patch",
                "/reprocess",
                {
                  param: {
                    id: string;
                  };
                },
                {}
              >,
            "/:id"
          > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "get",
                "/",
                {
                  query: {
                    user_id: string;
                    organization_id: string;
                  };
                },
                {}
              >,
              "/duplicate_warning"
            > &
            import("hono/types").MergeSchemaPath<
              import("hono").ToSchema<
                "get",
                "/",
                {
                  query: {
                    search_siret?: string | undefined;
                    search_email?: string | undefined;
                    processed_requests?: string | undefined;
                    hide_non_verified_domain?: string | undefined;
                    hide_join_organization?: string | undefined;
                    page?: string | undefined;
                    page_size?: string | undefined;
                  };
                },
                {}
              >,
              ""
            >,
          "/legacy/moderations"
        >,
      ""
    > &
      import("hono/types").MergeSchemaPath<
        import("hono/types").BlankSchema,
        ""
      >,
    ""
  > &
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono/types").MergeSchemaPath<
          import("hono").ToSchema<
            "get",
            "/",
            {
              param: {
                id: string;
              };
            },
            {}
          > &
            import("hono").ToSchema<
              "put",
              "/",
              {
                param: {
                  id: string;
                };
              } & {
                form: {
                  "mail-subject": string;
                  response: string;
                };
              },
              {}
            >,
          "/email"
        > &
          import("hono/types").MergeSchemaPath<
            import("hono").ToSchema<
              "get",
              "/",
              {
                param: {
                  id: string;
                };
              },
              {}
            >,
            ""
          > &
          import("hono").ToSchema<
            "patch",
            "/rejected",
            {
              param: {
                id: string;
              };
            },
            {}
          > &
          import("hono").ToSchema<
            "patch",
            "/processed",
            {
              param: {
                id: string;
              };
            },
            {}
          > &
          import("hono").ToSchema<
            "patch",
            "/reprocess",
            {
              param: {
                id: string;
              };
            },
            {}
          >,
        "/:id"
      > &
        import("hono/types").MergeSchemaPath<
          import("hono").ToSchema<
            "get",
            "/",
            {
              query: {
                user_id: string;
                organization_id: string;
              };
            },
            {}
          >,
          "/duplicate_warning"
        > &
        import("hono/types").MergeSchemaPath<
          import("hono").ToSchema<
            "get",
            "/",
            {
              query: {
                search_siret?: string | undefined;
                search_email?: string | undefined;
                processed_requests?: string | undefined;
                hide_non_verified_domain?: string | undefined;
                hide_join_organization?: string | undefined;
                page?: string | undefined;
                page_size?: string | undefined;
              };
            },
            {}
          >,
          ""
        >,
      "/moderations"
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"get", "/", unknown, {}> &
        import("hono").ToSchema<
          "get",
          `/assets/${string}/_client/hyyypertitle.js`,
          unknown,
          {}
        >,
      ""
    > &
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono").ToSchema<"post", "/login", unknown, {}> &
          import("hono").ToSchema<"get", "/fake/login/callback", unknown, {}> &
          import("hono").ToSchema<
            "get",
            "/login/callback",
            {
              query: {
                code: string;
                state: string;
              };
            },
            {}
          > &
          import("hono").ToSchema<"get", "/logout", unknown, {}>,
        "/auth/"
      >,
      ""
    > &
    import("hono/types").MergeSchemaPath<
      import("hono/types").MergeSchemaPath<
        import("hono").ToSchema<
          "get",
          "/zammad/attachment/:ticket_id/:article_id/:attachment_id",
          {
            param: {
              article_id: string;
              attachment_id: string;
              ticket_id: string;
            };
          },
          {}
        > &
          import("hono").ToSchema<"get", "/bundle/env.js", unknown, {}> &
          import("hono").ToSchema<"get", "/bundle/lit.js", unknown, {}> &
          import("hono").ToSchema<"get", "/bundle/lit/*", unknown, {}>,
        `/assets/${string}`
      >,
      ""
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"get", "/proxy/localhost:3000/*", unknown, {}>,
      ""
    > &
    import("hono/types").MergeSchemaPath<
      import("hono").ToSchema<"get", "/", unknown, {}> &
        import("hono").ToSchema<"get", "/sentry/error", unknown, never> &
        import("hono").ToSchema<"get", "/zammad", unknown, {}> &
        import("hono").ToSchema<"get", "/drizzle/moncomptepro", unknown, {}>,
      "/readyz"
    > &
    import("hono").ToSchema<"get", "/healthz", unknown, {}> &
    import("hono").ToSchema<"get", "/livez", unknown, {}>,
  "/"
>;
export type Router = typeof app;
export default app;