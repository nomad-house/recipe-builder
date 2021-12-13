import { APIGatewayProxyHandler } from "aws-lambda";
import { Descendant } from "slate";

const document: Descendant[] = [];

export const handler: APIGatewayProxyHandler = async (event, context) => {
  return {
    body: JSON.stringify(document),
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    }
  };
};
