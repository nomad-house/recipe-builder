import { Construct, Fn, RemovalPolicy, Stack } from "@aws-cdk/core";
import {
  Role,
  FederatedPrincipal,
  RoleProps,
  PolicyDocument,
  PolicyStatement,
  Policy
} from "@aws-cdk/aws-iam";
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolDomain,
  CfnUserPoolGroup,
  Mfa,
  OAuthSettings,
  UserPoolClientIdentityProvider,
  CfnUserPoolUICustomizationAttachment
} from "@aws-cdk/aws-cognito";
import { Mutable } from "../../Mutable";

export interface CognitoProps {
  prefix: string;
  userPoolMfa?: boolean;
  samlAuth?: boolean;
  callbackUrls?: string[];
  dns?: {
    certificateArn: string;
    rootDomain: string;
  };
  oAuthSettings?: OAuthSettings;
  sharedPolicyStatements?: PolicyStatement[];
  adminRoleStatements?: PolicyStatement[];
  authRoleStatements?: PolicyStatement[];
  css?: string;
}

export class Cognito extends Stack {
  public userPool: UserPool;
  public userPoolClient: UserPoolClient;
  public identityPool: CfnIdentityPool;
  public adminRole: Role;
  public authenticatedRole: Role;
  public userPoolDomain: CfnUserPoolDomain;
  constructor(
    scope: Construct,
    id: string,
    {
      prefix,
      userPoolMfa,
      samlAuth,
      dns,
      oAuthSettings,
      sharedPolicyStatements,
      adminRoleStatements,
      authRoleStatements,
      css
    }: CognitoProps
  ) {
    super(scope, id);
    const prod = prefix.split("-").pop() === "prod";
    this.userPool = new UserPool(this, "UserPool", {
      userPoolName: `${prefix}`,
      removalPolicy: prod ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoVerify: {
        email: true
      },
      mfa: userPoolMfa ? Mfa.REQUIRED : Mfa.OFF,
      selfSignUpEnabled: false,
      standardAttributes: {
        email: {
          required: true,
          mutable: samlAuth
        }
      }
    });
    this.userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPoolClientName: `${prefix}`,
      userPool: this.userPool,
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      generateSecret: false,
      oAuth: oAuthSettings
    });
    this.identityPool = new CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: `${prefix}`,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          serverSideTokenCheck: false,
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName
        }
      ]
    });
    this.identityPool.applyRemovalPolicy(RemovalPolicy.DESTROY);
    const roleProps: Mutable<RoleProps> = {
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
    if (sharedPolicyStatements?.length) {
      roleProps.inlinePolicies = {
        [`${prefix}-base-permissions`]: new PolicyDocument({
          statements: sharedPolicyStatements
        })
      };
    }
    this.adminRole = new Role(this, "AdminGroupRole", roleProps);
    if (adminRoleStatements?.length) {
      const name = `${prefix}-authenticated-policy`;
      this.adminRole.attachInlinePolicy(
        new Policy(this, name, {
          policyName: name,
          statements: adminRoleStatements
        })
      );
    }
    this.authenticatedRole = new Role(this, "AuthenticatedRole", roleProps);
    if (authRoleStatements?.length) {
      const name = `${prefix}-authenticated-policy`;
      this.authenticatedRole.attachInlinePolicy(
        new Policy(this, name, {
          policyName: name,
          statements: authRoleStatements
        })
      );
    }
    new CfnUserPoolGroup(this, "AdminGroup", {
      groupName: "admin",
      userPoolId: this.userPool.userPoolId,
      roleArn: this.adminRole.roleArn
    });
    new CfnIdentityPoolRoleAttachment(this, "AuthorizedUserRoleAttachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn
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
    /* eslint-disable indent */
    this.userPoolDomain = new CfnUserPoolDomain(
      this,
      "UserPoolDomain",
      dns
        ? {
            userPoolId: this.userPool.userPoolId,
            domain: `auth.voicemail.${dns.rootDomain}`,
            customDomainConfig: { certificateArn: dns.certificateArn }
          }
        : {
            userPoolId: this.userPool.userPoolId,
            domain: prefix
          }
    );
    /* eslint-enable indent */
    if (css) {
      new CfnUserPoolUICustomizationAttachment(this, "CognitoUICustomization", {
        userPoolId: this.userPool.userPoolId,
        clientId: this.userPoolClient.userPoolClientId,
        css
      });
    }
  }
}
