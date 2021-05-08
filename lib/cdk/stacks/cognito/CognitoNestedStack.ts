import { CfnIdentityPool, CfnUserPoolDomain, UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";
import { BaseNestedStack, BaseNestedStackProps } from "../BaseStack";
import { CognitoConstruct, CognitoConstructProps } from "./CognitoConstruct";

export interface CognitoNestedStackProps extends BaseNestedStackProps, CognitoConstructProps {}

export class CognitoNestedStack extends BaseNestedStack {
  public userPool!: UserPool;
  public userPoolClient!: UserPoolClient;
  public userPoolDomain!: CfnUserPoolDomain;
  public identityPool!: CfnIdentityPool;
  public roles: { [groupName: string]: Role } = {};

  constructor(scope: Construct, id: string, props: CognitoNestedStackProps) {
    super(scope, id, props);
    const { userPool, userPoolClient, userPoolDomain, identityPool, roles } = new CognitoConstruct(
      this,
      "CognitoConstruct",
      props
    );
    this.userPool = userPool;
    this.userPoolClient = userPoolClient;
    this.userPoolDomain = userPoolDomain;
    this.identityPool = identityPool;
    this.roles = roles;
  }
}
