import { Construct, Stack, StackProps } from "@aws-cdk/core";
import {
  ArnPrincipal,
  Effect,
  Policy,
  PolicyStatement,
  Role,
  ServicePrincipal,
  PolicyDocument
} from "@aws-cdk/aws-iam";
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolDomain,
  CfnUserPool,
  CfnUserPoolClient
} from "@aws-cdk/aws-cognito";

export interface AuthStackParams extends StackProps {}

export class AuthStack extends Stack {
  constructor(scope: Construct, id: string, params: AuthStackParams) {
    super(scope, id, params);
    const userPool = new UserPool(this, "UserPool", {
      userPoolName: ``
    });
    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: ``
      //   clientName: ``,
    });
    const identityPool = new CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: ``,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          serverSideTokenCheck: false,
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });
    new CfnIdentityPoolRoleAttachment(this, "AuthorizedUserRoleAttachment", {
      identityPoolId: identityPool.ref,
      roleMappings: {
        userPool: {
          type: "Rules",
          ambiguousRoleResolution: "Deny",
          identityProvider: userPool.userPoolId,
          rulesConfiguration: {
            rules: [
              {
                claim: "cognito:groups",
                matchType: "Equals",
                value: "users",
                roleArn: "user-arn"
              },
              {
                claim: "cognito:groups",
                matchType: "Equals",
                value: "admin",
                roleArn: "admin-arn"
              }
            ]
          }
        }
      }
    });
  }
}
