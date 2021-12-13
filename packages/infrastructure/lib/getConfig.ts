/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getConfig as GET_CONFIG } from "full-stack-pattern";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const staticProps = {
  client: "mk",
  project: "fsp-docs",
  rootDomain: "matthewkeil.com",
  subDomain: "full-stack-pattern"
};

interface Stage {
  branch: string;
  profile: string;
  env: {
    account: string;
    region: string;
  };
}

const stages: Stage[] = [
  {
    branch: "master",
    profile: process.env.PROFILE!,
    env: {
      account: process.env.ACCOUNT_ID!,
      region: process.env.REGION!
    }
  }
];

export function getConfig(branch?: string) {
  return GET_CONFIG(stages, staticProps)(branch);
}
