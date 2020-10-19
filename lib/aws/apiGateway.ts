import { APIGateway, IAM } from "aws-sdk";

const iam = new IAM({ region: process.env.REGION });
const apiGateway = new APIGateway({ region: process.env.REGION });

export const apiGatewayAccountExists = async () => {
  try {
    const { cloudwatchRoleArn } = await apiGateway.getAccount().promise();
    const RoleName = cloudwatchRoleArn.split("/")[1];
    await iam.getRole({ RoleName }).promise();
    return true;
  } catch (err) {
    if (err.code === "NoSuchEntity") return false;
  }
};
