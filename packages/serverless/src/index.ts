import { resolve } from "path";
import { Lambdas, LambdasProps } from "full-stack-pattern";
import { Construct } from "@aws-cdk/core";

export const SERVERLESS_SRC_DIR = resolve(__dirname);
export const LAYER_SRC_DIR = resolve(__dirname, "..", "layer");
export function loadLambdas(scope: Construct, props?: Partial<LambdasProps>): Lambdas {
  return new Lambdas(scope, "Lambdas", {
    ...props,
    ...lambdasProps
  });
}

export const lambdasProps: LambdasProps = {
  code: SERVERLESS_SRC_DIR,
  layers: [LAYER_SRC_DIR],
  lambdas: [
    {
      name: "graphql",
      handler: "graphql/handler.handler",
      events: [
        {
          method: "GET",
          path: "/graphql"
        },
        {
          method: "POST",
          path: "/graphql"
        }
      ]
    },
    {
      name: "netlify-auth-uri",
      handler: "netlify/index.authUri",
      events: [
        {
          method: "GET",
          path: "/netlify/auth"
        }
      ],
      environment: {
        JWT_SECRET: "",
        GITHUB_CLIENT_ID: ""
      }
    },
    {
      name: "netlify-auth-callback",
      handler: "netlify/index.authCallback",
      events: [
        {
          method: "GET",
          path: "/netlify/callback"
        }
      ],
      environment: {
        JWT_SECRET: "",
        ORIGIN: "",
        GITHUB_CLIENT_ID: "",
        GITHUB_CLIENT_SECRET: ""
      }
    },
    {
      name: "netlify-auth-success",
      handler: "netlify/index.authSuccess",
      events: [
        {
          method: "GET",
          path: "/netlify/success"
        }
      ]
    }
  ]
};
