import { CfnIdentityPool, CfnUserPoolDomain, UserPool, UserPoolClient } from "@aws-cdk/aws-cognito";
import { Role } from "@aws-cdk/aws-iam";
import { Construct } from "@aws-cdk/core";
import { BaseStack, BaseStackProps } from "../BaseStack";
import { CognitoConstruct, CognitoConstructProps } from "./CognitoConstruct";

export interface CognitoStackProps extends BaseStackProps, CognitoConstructProps {}

export class CognitoStack extends BaseStack {
  public userPool!: UserPool;
  public userPoolClient!: UserPoolClient;
  public userPoolDomain!: CfnUserPoolDomain;
  public identityPool!: CfnIdentityPool;
  public roles: { [groupName: string]: Role } = {};

  constructor(scope: Construct, id: string, props: CognitoStackProps) {
    super(scope, id, { ...props, stackName: props.stackName ?? `${props.prefix}-cognito` });
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
