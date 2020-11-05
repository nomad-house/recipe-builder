require("dotenv").config();
import { resolve } from "path";
import { App } from "@aws-cdk/core";
import { getHostedZoneId } from "../lib/aws/route53";
import { getApiGatewayAccountRole } from "../lib/aws/apiGateway";
import { CoreStack } from "../lib/cdk/CoreStack";
import { StaticAssetsStack } from "../lib/cdk/StaticAssetsStack";

interface SynthParams {
  project: string;
  stage: string;
  region: string;
  account: string;
  rootDomain: string;
}

export async function synth({ project, stage, region, account, rootDomain }: SynthParams) {
  const app = new App();
  const env = {
    region,
    account
  };
  const cloudWatchRoleArn = await getApiGatewayAccountRole();
  const hostedZoneId = await getHostedZoneId({ rootDomain });
  const coreStack = new CoreStack(app, "CoreStack", {
    stackName: `${project}-core`,
    env,
    rootDomain,
    hostedZoneId,
    cloudWatchRoleArn
  });

  new StaticAssetsStack(app, "FrontEndStack", {
    stackName: `${project}-frontend-${stage}`,
    env,
    stage,
    rootDomain,
    sourcePath: resolve(__dirname, "..", "client", "dist"),
    hostedZone: coreStack.hostedZone,
    certificate: coreStack.certificate,
    buildWwwSubdomain: true
  });

  app.synth();
}

// if (require.main === module) {
synth({
  project: "codeified",
  stage: "prod",
  account: `${process.env.ACCOUNT}`,
  region: `${process.env.REGION}`,
  rootDomain: `${process.env.ROOT_DOMAIN}`
});
// }
