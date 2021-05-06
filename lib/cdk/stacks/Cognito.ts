import { Construct, Fn, RemovalPolicy, Stack } from "@aws-cdk/core";
import {
  Role,
  FederatedPrincipal,
  RoleProps,
  PolicyDocument,
  PolicyStatement
} from "@aws-cdk/aws-iam";
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolDomain,
  CfnUserPoolGroup,
  UserPoolClientIdentityProvider,
  CfnUserPoolUICustomizationAttachment,
  CfnIdentityPoolProps,
  UserPoolProps,
  UserPoolClientProps
} from "@aws-cdk/aws-cognito";
import { Mutable } from "../../Mutable";
import { BaseStack, BaseStackProps } from "./BaseStack";
import { toKebab, toPascal } from "../../changeCase";

interface CognitoGroupConfig {
  groupName: string;
  policyStatements?: PolicyStatement[];
}
type IdentityPoolConfig = CfnIdentityPoolProps & { removalPolicy?: RemovalPolicy };
export interface CognitoProps extends BaseStackProps {
  userPool?: UserPoolProps;
  userPoolClient?: Omit<UserPoolClientProps, "userPool">;
  identityPool?: IdentityPoolConfig;
  dns?: {
    certificateArn?: string;
    domain: string;
  };
  policyStatements?: PolicyStatement[];
  groups?: CognitoGroupConfig[];
  css?: string;
  samlAuth?: boolean;
}

export class Cognito extends BaseStack {
  private static DEFAULT_GROUP_NAME = "authenticated";
  public userPool!: UserPool;
  public userPoolClient!: UserPoolClient;
  public userPoolDomain!: CfnUserPoolDomain;
  public identityPool!: CfnIdentityPool;
  public roles: { [groupName: string]: Role } = {};

  constructor(scope: Construct, id: string, props: CognitoProps) {
    super(scope, id, { ...props, stackName: `${props.prefix}-cognito` });
    this.buildUserPool(props);
    this.buildGroups(props);
    this.buildIdentityPool(props);

    if (props.css) {
      new CfnUserPoolUICustomizationAttachment(this, "CognitoUICustomization", {
        userPoolId: this.userPool.userPoolId,
        clientId: this.userPoolClient.userPoolClientId,
        css: props.css
      });
    }
  }

  buildUserPool({ prefix, userPool, userPoolClient, samlAuth, dns }: CognitoProps) {
    this.userPool = new UserPool(this, "UserPool", {
      ...userPool,
      userPoolName: prefix,
      removalPolicy: this.prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      selfSignUpEnabled: userPool?.selfSignUpEnabled ?? false,
      autoVerify: userPool?.autoVerify ?? {
        email: true
      },
      standardAttributes: userPool?.standardAttributes ?? {
        email: {
          required: true,
          mutable: samlAuth
        }
      }
    });
    this.userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      ...userPoolClient,
      userPoolClientName: prefix,
      userPool: this.userPool,
      supportedIdentityProviders: userPoolClient?.supportedIdentityProviders ?? [
        UserPoolClientIdentityProvider.COGNITO
      ],
      generateSecret: userPoolClient?.generateSecret ?? false
    });
    this.userPoolDomain = new CfnUserPoolDomain(
      this,
      "UserPoolDomain",
      dns
        ? {
            userPoolId: this.userPool.userPoolId,
            domain: dns.domain,
            customDomainConfig: dns.certificateArn
              ? { certificateArn: dns.certificateArn }
              : undefined
          }
        : {
            userPoolId: this.userPool.userPoolId,
            domain: prefix
          }
    );
  }

  buildGroups(props: CognitoProps) {
    const defaultGroups: CognitoGroupConfig[] = [
      {
        groupName: Cognito.DEFAULT_GROUP_NAME,
        policyStatements: props.policyStatements
      }
    ];
    const groups = props.groups?.find(({ groupName }) => groupName === Cognito.DEFAULT_GROUP_NAME)
      ? props.groups
      : props.groups?.length
      ? defaultGroups.concat(...props.groups)
      : defaultGroups;

    for (const group of groups) {
      const roleProps: Mutable<RoleProps> = {
        roleName: `${this.prefix}-group-role`,
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "authenticated"
            }
          },
          "sts:AssumeRoleWithWebIdentity"
        )
      };
      const policyStatements = [
        ...(group.policyStatements ?? []),
        ...(props.policyStatements ?? [])
      ];
      if (policyStatements?.length) {
        roleProps.inlinePolicies = {
          [`${this.prefix}-${group.groupName}`]: new PolicyDocument({
            statements: policyStatements
          })
        };
      }
      const role = new Role(this, `${toPascal(group.groupName)}GroupRole`, roleProps);
      if (group.groupName !== Cognito.DEFAULT_GROUP_NAME) {
        new CfnUserPoolGroup(this, `${toPascal(group.groupName)}Group`, {
          groupName: toKebab(group.groupName),
          roleArn: role.roleArn,
          userPoolId: this.userPool.userPoolId
        });
      }
      this.roles[group.groupName] = role;
    }
  }

  buildIdentityPool({ prefix, identityPool }: CognitoProps) {
    const defaultProvider: CfnIdentityPoolProps["cognitoIdentityProviders"] = [
      {
        serverSideTokenCheck: false,
        clientId: this.userPoolClient.userPoolClientId,
        providerName: this.userPool.userPoolProviderName
      }
    ];
    const cognitoIdentityProviders = Array.isArray(identityPool?.cognitoIdentityProviders)
      ? [...(identityPool as any).cognitoIdentityProviders, ...defaultProvider]
      : identityPool?.cognitoIdentityProviders
      ? [identityPool?.cognitoIdentityProviders, ...defaultProvider]
      : defaultProvider;

    this.identityPool = new CfnIdentityPool(this, "IdentityPool", {
      ...(identityPool || []),
      identityPoolName: prefix,
      cognitoIdentityProviders,
      allowUnauthenticatedIdentities: identityPool?.allowUnauthenticatedIdentities ?? false
    });

    if (identityPool?.removalPolicy) {
      this.identityPool.applyRemovalPolicy(identityPool.removalPolicy);
    }

    new CfnIdentityPoolRoleAttachment(this, "AuthorizedUserRoleAttachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.roles[Cognito.DEFAULT_GROUP_NAME].roleArn
      },
      roleMappings: {
        cognitoProvider: {
          identityProvider: Fn.join("", [
            "cognito-idp.",
            Stack.of(this).region,
            ".amazonaws.com/",
            this.userPool.userPoolId,
            ":",
            this.userPoolClient.userPoolClientId
          ]),
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole"
        }
      }
    });
  }
}
