import { resolve } from "path";
import { Construct, Stack, StackProps } from "@aws-cdk/core";
import { Function as Lambda, AssetCode, Runtime } from "@aws-cdk/aws-lambda";
import { CfnAuthorizer, LambdaRestApi } from "@aws-cdk/aws-apigateway";
import { UserPool } from "@aws-cdk/aws-cognito";

interface BackendStackProps extends StackProps {
  prefix: string;
  userPool: UserPool;
}

export class BackendStack extends Stack {
  constructor(scope: Construct, id: string, props: BackendStackProps) {
    super(scope, id, props);

    const handler = new Lambda(this, "Handler", {
      code: new AssetCode(resolve(__dirname, "..", "..", "backend", "dist")),
      handler: "index.lambda",
      runtime: Runtime.NODEJS_12_X
    });

    const api = new LambdaRestApi(this, "Api", {
      handler,
      proxy: true
    });

    new CfnAuthorizer(this, "UserPoolAuthorizer", {
      name: props.prefix,
      restApiId: api.restApiId,
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [props.userPool.userPoolArn]
    });
  }
}
