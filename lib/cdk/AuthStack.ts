import { Construct, NestedStack, NestedStackProps } from "@aws-cdk/core";
import { Role, FederatedPrincipal, RoleProps } from "@aws-cdk/aws-iam";
import {
  UserPool,
  UserPoolClient,
  CfnIdentityPool,
  CfnIdentityPoolRoleAttachment,
  CfnUserPoolDomain,
  CfnUserPoolGroup,
  Mfa
} from "@aws-cdk/aws-cognito";

export interface AuthStackParams extends NestedStackProps {
  prefix: string;
  userPoolMfa?: boolean;
  samlAuth?: boolean;
  dns?: {
    certificateArn: string;
    rootDomain: string;
  };
}

export class AuthStack extends NestedStack {
  public roles: { [roleName: string]: Role } = {};
  constructor(scope: Construct, id: string, params: AuthStackParams) {
    super(scope, id, params);
    const { prefix, userPoolMfa, samlAuth, dns } = params;

    const userPool = new UserPool(this, "UserPool", {
      userPoolName: `${prefix}`,
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
    new CfnUserPoolDomain(
      this,
      "UserPoolDomain",
      dns
        ? {
            userPoolId: userPool.userPoolId,
            domain: `auth.voicemail.${dns.rootDomain}`,
            customDomainConfig: { certificateArn: dns.certificateArn }
          }
        : {
            userPoolId: userPool.userPoolId,
            domain: prefix
          }
    );
    const userPoolClient = new UserPoolClient(this, "UserPoolClient", {
      userPoolClientName: `${prefix}`,
      userPool,
      generateSecret: false
    });
    const identityPool = new CfnIdentityPool(this, "IdentityPool", {
      identityPoolName: `${prefix}`,
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [
        {
          serverSideTokenCheck: false,
          clientId: userPoolClient.userPoolClientId,
          providerName: userPool.userPoolProviderName
        }
      ]
    });

    const roleProps: RoleProps = {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": identityPool.ref
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated"
          }
        },
        "sts:AssumeRoleWithWebIdentity"
      )
    };
    this.roles.authenticated = new Role(this, `AuthenticatedRole`, roleProps);
    new CfnIdentityPoolRoleAttachment(this, "AuthorizedUserRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: this.roles.authenticated.roleArn
      }
    });

    for (const { name } of groups) {
      this.roles[name] = new Role(this, `${toPascal}GroupRole`, roleProps);
      new CfnUserPoolGroup(this, `AdminGroup`, {
        groupName: "admin",
        userPoolId: userPool.userPoolId,
        roleArn: this.roles.admin.roleArn
      });
    }
  }
}

// type Rules = CfnIdentityPoolRoleAttachment.RulesConfigurationTypeProperty["rules"];
// interface VoiceMailGroup {
//   name: string;
// }
// groups?: VoiceMailGroup[];
// groups = [],
// const rules: Rules = [];
// rules.push({
//   claim: "cognito:groups",
//   matchType: "Equals",
//   value: name,
//   roleArn: role.roleArn,
// });
// }
// roleMappings: {
//   userPool: {
//     type: "Rules",
//     ambiguousRoleResolution: "Deny",
//     identityProvider: userPool.userPoolId,
//     rulesConfiguration: { rules },
//   },
// },
