import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { Descendant } from "slate";

const document: Descendant[] = [];

interface GetDocumentEvent extends APIGatewayProxyEvent {
  pathParameters: {
    id: string;
  };
}
export const getDocument: APIGatewayProxyHandler = async (event) => {
  const {
    pathParameters: { id }
  } = event as GetDocumentEvent;

  return {
    body: JSON.stringify(document),
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    }
  };
};

export const deleteDocument: APIGatewayProxyHandler = async (event, context) => {
  return {
    body: JSON.stringify(document),
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    }
  };
};
