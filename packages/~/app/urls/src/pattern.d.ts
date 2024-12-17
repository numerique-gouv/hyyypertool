declare const app: import("hono/hono-base").HonoBase<
  import("@~/app.middleware/set_nonce").NonceVariables_Context &
    import("@~/app.middleware/set_config").ConfigVariables_Context &
    import("@~/app.middleware/set_userinfo").UserInfoVariables_Context &
    import("@~/app.middleware/moncomptepro_pg").MonComptePro_Pg_Context,
  | ({
      "/healthz": {
        $get: {
          input: {};
          output: "healthz check passed";
          outputFormat: "text";
          status: import("hono/utils/http-status").StatusCode;
        };
      };
    } & {
      "/livez": {
        $get: {
          input: {};
          output: "livez check passed";
          outputFormat: "text";
          status: import("hono/utils/http-status").StatusCode;
        };
      };
    })
  | import("hono/types").MergeSchemaPath<
      | ({
          "/public/*": {};
        } & {
          "/bundle/config.js": {
            $get: {
              input: {};
              output: `export default ${string}`;
              outputFormat: "text";
              status: 200;
            };
          };
        } & {
          "/bundle/env.js": {
            $get: {
              input: {};
              output: `export default ${string}`;
              outputFormat: "text";
              status: 200;
            };
          };
        })
      | import("hono/types").MergeSchemaPath<
          {
            "/attachment/:ticket_id/:article_id/:attachment_id": {
              $get: {
                input: {
                  param: {
                    article_id: string;
                    attachment_id: string;
                    ticket_id: string;
                  };
                };
                output: {};
                outputFormat: string;
                status: import("hono/utils/http-status").StatusCode;
              };
            };
          },
          "/zammad"
        >,
      `/assets/${string}`
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            input: {};
            output: "readyz check passed";
            outputFormat: "text";
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/sentry": {
          $get: never;
        };
      } & {
        "/zammad": {
          $get: {
            input: {};
            output: string;
            outputFormat: "text";
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/drizzle/moncomptepro": {
          $get: {
            input: {};
            output: string;
            outputFormat: "text";
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/readyz"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/localhost:3000/*": {
          $get: {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      },
      "/proxy"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "/": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/"
    >
  | import("hono/types").MergeSchemaPath<
      {
        "*": {};
      } & {
        "/login": {
          $post: {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      } & {
        "/fake/login/callback": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      } & {
        "/login/callback": {
          $get: {
            input: {
              query: {
                code: string;
                state: string;
              };
            };
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      } & {
        "/logout": {
          $get: {
            input: {};
            output: undefined;
            outputFormat: "redirect";
            status: 302;
          };
        };
      },
      "/auth"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            | {
                "/": {
                  $get: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                  };
                };
              }
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get: {
                      input: {
                        param: {
                          id: string;
                        };
                      } & {
                        query: {
                          describedby: string;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    };
                  };
                },
                "/email"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get: {
                      input: {
                        param: {
                          id: string;
                        };
                      } & {
                        query: {
                          user_id: string;
                          organization_id: string;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    };
                  };
                },
                "/duplicate_warning"
              >
            | import("hono/types").MergeSchemaPath<
                | import("hono/types").BlankSchema
                | import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $patch: {
                          input: {
                            param: {
                              id: string;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        };
                      };
                    },
                    "/processed"
                  >
                | import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $patch: {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              message: string;
                              subject: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                      };
                    },
                    "/rejected"
                  >
                | import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $patch: {
                          input: {
                            param: {
                              id: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                      };
                    },
                    "/reprocess"
                  >
                | import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $patch: {
                          input: {
                            param: {
                              id: string;
                            };
                          } & {
                            form: {
                              add_member: "AS_INTERNAL" | "AS_EXTERNAL";
                              add_domain?: string | undefined;
                              send_notitfication?: string | undefined;
                            };
                          };
                          output: {};
                          outputFormat: string;
                          status: import("hono/utils/http-status").StatusCode;
                        };
                      };
                    },
                    "/validate"
                  >,
                "/$procedures"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/moderations"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            | ({
                "/": {
                  $get: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                  };
                };
              } & {
                "/": {
                  $delete: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  };
                };
              } & {
                "/reset/email_verified": {
                  $patch: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  };
                };
              } & {
                "/reset/password": {
                  $patch: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  };
                };
              } & {
                "/reset/mfa": {
                  $patch: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: "OK";
                    outputFormat: "text";
                    status: 200;
                  };
                };
              })
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get: {
                      input: {
                        param: {
                          id: string;
                        };
                      } & {
                        query: {
                          describedby: string;
                          page?: string | undefined;
                          page_size?: string | undefined;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    };
                  };
                },
                "/organizations"
              >
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {};
                } & {
                  "/": {
                    $get: {
                      input: {
                        param: {
                          id: string;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    };
                  };
                },
                "/moderations"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get: {
            input: {
              query: {
                page?: string | undefined;
                page_size?: string | undefined;
                q?: string | undefined;
              };
            };
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/users"
    >
  | import("hono/types").MergeSchemaPath<
      (
        | import("hono/types").BlankSchema
        | import("hono/types").MergeSchemaPath<
            {
              "/": {
                $get: {
                  input: {
                    query: {
                      siret: string;
                    };
                  };
                  output: {};
                  outputFormat: string;
                  status: import("hono/utils/http-status").StatusCode;
                };
              };
            },
            "/leaders"
          >
        | import("hono/types").MergeSchemaPath<
            {
              "/": {};
            } & {
              "/": {
                $get: {
                  input: {
                    query: {
                      page?: string | undefined;
                      page_size?: string | undefined;
                      q?: string | undefined;
                    };
                  };
                  output: {};
                  outputFormat: string;
                  status: import("hono/utils/http-status").StatusCode;
                };
              };
            },
            "/domains"
          >
        | import("hono/types").MergeSchemaPath<
            | ({
                "/": {};
              } & {
                "/": {
                  $get: {
                    input: {
                      param: {
                        id: string;
                      };
                    };
                    output: {};
                    outputFormat: string;
                    status: import("hono/utils/http-status").StatusCode;
                  };
                };
              })
            | import("hono/types").MergeSchemaPath<
                {
                  "/": {
                    $get: {
                      input: {
                        param: {
                          id: string;
                        };
                      } & {
                        query: {
                          describedby: string;
                        };
                      };
                      output: {};
                      outputFormat: string;
                      status: import("hono/utils/http-status").StatusCode;
                    };
                  };
                } & {
                  "/": {
                    $put: {
                      input: {
                        param: {
                          id: string;
                        };
                      } & {
                        form: {
                          domain: string;
                        };
                      };
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                    };
                  };
                } & {
                  "/:domain_id": {
                    $delete: {
                      input: {
                        param: {
                          id: string;
                          domain_id: string;
                        };
                      };
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                    };
                  };
                } & {
                  "/:domain_id": {
                    $patch: {
                      input: {
                        param: {
                          id: string;
                          domain_id: string;
                        };
                      } & {
                        query: {
                          type: string | string[];
                        };
                      };
                      output: "OK";
                      outputFormat: "text";
                      status: 200;
                    };
                  };
                },
                "/domains"
              >
            | import("hono/types").MergeSchemaPath<
                | {
                    "/": {
                      $get: {
                        input: {
                          param: {
                            id: string;
                          };
                        } & {
                          query: {
                            describedby: string;
                            page_ref: string;
                            page?: string | undefined;
                            page_size?: string | undefined;
                          };
                        };
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                      };
                    };
                  }
                | (import("hono/types").MergeSchemaPath<
                    {
                      "/": {
                        $post: {
                          input: {
                            form: {
                              is_external: string;
                            };
                          } & {
                            param: {
                              id: string;
                              user_id: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                      };
                    } & {
                      "/": {
                        $patch: {
                          input: {
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
                                | "no_validation_means_available"
                                | "official_contact_domain"
                                | "official_contact_email"
                                | "trackdechets_email_domain"
                                | "verified_by_coop_mediation_numerique"
                                | "verified_email_domain"
                                | undefined;
                              is_external?: string | undefined;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                      };
                    } & {
                      "/": {
                        $delete: {
                          input: {
                            param: {
                              id: string;
                              user_id: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                      };
                    },
                    "/:user_id"
                  > & {
                    "/": {
                      $get: {
                        input: {
                          param: {
                            id: string;
                          };
                        } & {
                          query: {
                            describedby: string;
                            page_ref: string;
                            page?: string | undefined;
                            page_size?: string | undefined;
                          };
                        };
                        output: {};
                        outputFormat: string;
                        status: import("hono/utils/http-status").StatusCode;
                      };
                    };
                  }),
                "/members"
              >
            | import("hono/types").MergeSchemaPath<
                | import("hono/types").BlankSchema
                | import("hono/types").MergeSchemaPath<
                    {
                      "/:domain": {
                        $patch: {
                          input: {
                            param: {
                              id: string;
                              domain: string;
                            };
                          };
                          output: "OK";
                          outputFormat: "text";
                          status: 200;
                        };
                      };
                    },
                    "/verify"
                  >,
                "/$procedures"
              >,
            "/:id"
          >
      ) & {
        "/": {
          $get: {
            input: {
              query: {
                id?: string | undefined;
                page?: string | undefined;
                page_size?: string | undefined;
                q?: string | undefined;
              };
            };
            output: {};
            outputFormat: string;
            status: import("hono/utils/http-status").StatusCode;
          };
        };
      },
      "/organizations"
    >,
  "/"
>;
export type Router = typeof app;
export default app;
