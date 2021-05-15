import { APIGatewayProxyHandler } from "aws-lambda";
export const handler: APIGatewayProxyHandler = async (event, context, callback) => {
  console.log(event);
  return {
    statusCode: 200,
    body: ""
  };
};
