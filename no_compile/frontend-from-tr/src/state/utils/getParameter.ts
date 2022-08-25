import { SSM } from "@aws-sdk/client-ssm";

let ssm: undefined | SSM;

interface GetParameterProps {
  region?: string;
  parameterName: string;
  withDecryption?: boolean;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
}

/**
 * @defaults { region: "us-east-1", withDecryption: true }
 */
export async function getParameter({
  region,
  parameterName,
  credentials,
  withDecryption = true
}: GetParameterProps): Promise<string> {
  if (!ssm) {
    ssm = new SSM({
      region,
      credentials
    });
  }

  const response = await ssm.getParameter({
    Name: parameterName,
    WithDecryption: withDecryption
  });

  const value = response.Parameter?.Value;
  if (!value) {
    throw new Error("invalid value for " + parameterName);
  }

  return value;
}
