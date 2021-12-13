import { getConfig as GET_CONFIG } from "full-stack-pattern";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const staticProps = {
  client: "co", // CODEified Org
  project: "codeified",
  rootDomain: "codeified.org"
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
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    profile: process.env.PROFILE!,
    env: {
      account: process.env.ACCOUNT_ID!,
      region: process.env.REGION!
    }
    /* eslint-enable @typescript-eslint/no-non-null-assertion */
  }
];

export function getConfig(branch?: string) {
  return GET_CONFIG(stages, staticProps)(branch);
}
