import { App, Construct, NestedStack, NestedStackProps } from "@aws-cdk/core";
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
import { toPascal } from "lib/rename";

export interface AuthStackParams extends NestedStackProps {
  prefix: string;
  userPoolMfa?: boolean;
  samlAuth?: boolean;
  groups: Readonly<string[]>;
  dns?: {
    certificateArn: string;
    rootDomain: string;
  };
}

export class AuthStack<T extends Readonly<string[]> = ["authenticated"]> extends NestedStack {
  public groupRoles: { [key in T[number] | "authenticated"]: Role } = {} as any;
  constructor(scope: Construct, id: string, public params: AuthStackParams) {
    super(scope, id, params);
    const { prefix, userPoolMfa, samlAuth, dns, groups = [] } = this.params;

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
    this.groupRoles.authenticated = new Role(this, `AuthenticatedRole`, roleProps);
    new CfnIdentityPoolRoleAttachment(this, "AuthorizedUserRoleAttachment", {
      identityPoolId: identityPool.ref,
      roles: {
        authenticated: this.groupRoles.authenticated.roleArn
      }
    });

    for (const name of groups) {
      this.groupRoles[name as T[number]] = new Role(this, `${toPascal(name)}GroupRole`, roleProps);
      new CfnUserPoolGroup(this, `${toPascal(name)}Group`, {
        groupName: "admin",
        userPoolId: userPool.userPoolId,
        roleArn: this.groupRoles[name as T[number]].roleArn
      });
    }
  }
}
