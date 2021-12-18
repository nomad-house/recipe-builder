import { resolve } from "path";
import { LambdasProps, ServerlessConstructProps } from "full-stack-pattern";

export const SERVERLESS_SRC_DIR = resolve(__dirname);
export const LAYER_SRC_DIR = resolve(__dirname, "..", "layer");
export const lambdas: LambdasProps["lambdas"] = [
  {
    name: "get-document",
    handler: "handlers/getDocument.handler",
    events: [
      {
        method: "POST",
        path: "/graphql"
      },
      {
        method: "GET",
        path: "/graphql"
      }
    ]
  }
  // {
  //   name: "netlify-auth-uri",
  //   handler: "netlify/index.authUri",
  //   events: [
  //     {
  //       method: "GET",
  //       path: "/netlify/auth"
  //     }
  //   ],
  //   environment: {
  //     JWT_SECRET: "",
  //     GITHUB_CLIENT_ID: ""
  //   }
  // },
  // {
  //   name: "netlify-auth-callback",
  //   handler: "netlify/index.authCallback",
  //   events: [
  //     {
  //       method: "GET",
  //       path: "/netlify/callback"
  //     }
  //   ],
  //   environment: {
  //     JWT_SECRET: "",
  //     ORIGIN: "",
  //     GITHUB_CLIENT_ID: "",
  //     GITHUB_CLIENT_SECRET: ""
  //   }
  // },
  // {
  //   name: "netlify-auth-success",
  //   handler: "netlify/index.authSuccess",
  //   events: [
  //     {
  //       method: "GET",
  //       path: "/netlify/success"
  //     }
  //   ]
  // }
];

export const serverlessProps: ServerlessConstructProps = {
  code: SERVERLESS_SRC_DIR,
  layers: [LAYER_SRC_DIR],
  lambdas,
  tables: [
    {
      name: "documents",
      partitionKey: {
        id: "string"
      },
      sortKey: {
        version: "string"
      },
      lsi: [
        {
          indexName: "userId",
          sortKey: {
            userId: "string"
          }
        }
      ]
    }
  ]
};
