import { APIGateway } from "aws-sdk";

const apiGateway = new APIGateway({ region: process.env.REGION });

export const apiGatewayAccountExists = async () => {
  try {
    const { cloudwatchRoleArn } = await apiGateway.getAccount().promise();
    return cloudwatchRoleArn;
  } catch (err) {
    if (err.code === "NoSuchEntity") return;
    throw err;
  }
};
