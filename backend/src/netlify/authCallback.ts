import { verify } from "jsonwebtoken";
import { APIGatewayEvent, Context, Callback, APIGatewayProxyResult } from "aws-lambda";
import { fetchToken } from "./fetchToken";
import { renderSuccess, renderError } from "./render";

export const handler = async (
  event: APIGatewayEvent,
  _: Context,
  callback: Callback<APIGatewayProxyResult>
) => {
  const origin = process.env.ORIGIN ?? "";
  const secret = process.env.JWT_SECRET ?? "lousy-secret-yo";
  const headers = { "Content-Type": "text/html; charset=utf-8" };
  const queryParams = event.queryStringParameters ?? {};
  const code = queryParams["code"];
  const state = queryParams["state"] as string;
  try {
    if (!code) {
      console.error("Code parameter missing");
      return callback(null, {
        statusCode: 400,
        headers,
        body: renderError(origin, "Code parameter missing")
      });
    }

    verify(state, secret, (err, _) => {
      if (err) {
        console.error(err);
        console.error("Invalid state parameter");
        return callback(null, {
          statusCode: 400,
          headers,
          body: renderError(origin, "Invalid state parameter")
        });
      }
    });

    const tokenResponse = await fetchToken(code);
    const { access_token, error } = tokenResponse;

    if (error) {
      console.error("tokenResponse error");
      console.error(error);
      return callback(null, {
        statusCode: 400,
        headers,
        body: renderError(origin, error)
      });
    }

    console.log({ origin, access_token });
    return callback(null, {
      statusCode: 200,
      headers,
      body: renderSuccess(origin, access_token)
    });
  } catch (err) {
    console.error(err);
    return callback(null, {
      statusCode: 500,
      headers,
      body: renderError(origin, JSON.stringify(err))
    });
  }
};
