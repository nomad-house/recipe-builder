import { APIGatewayEvent, Context, Callback } from "aws-lambda";

export const handler = (event: APIGatewayEvent, __: Context, callback: Callback) => {
  console.log(event);
  callback(null, { statusCode: 200, headers: { "Content-Type": "text/plain" }, body: "" });
};
