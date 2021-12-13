import { getConfig as GET_CONFIG, FullStackConstructProps } from "full-stack-pattern";
// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

const staticProps = {
  client: "co", // CODEified Org
  project: "codeified",
  rootDomain: "codeified.org"
};

interface Stage extends FullStackConstructProps {
  branch: string;
  profile: string;
  env: {
    account: string;
    region: string;
  };
}

// const JWT_SECRET = `${process.env.JWT_SECRET}`;
// const GITHUB_CLIENT_ID = `${process.env.GITHUB_CLIENT_ID}`;
// const GITHUB_CLIENT_SECRET = `${process.env.GITHUB_CLIENT_SECRET}`;
// const ORIGIN = process.env.ORIGIN ?? "http://localhost:3001";

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