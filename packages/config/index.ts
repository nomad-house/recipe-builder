import { resolve } from "path";
import { getConfig as GET_CONFIG, FullStackConstructProps } from "full-stack-pattern";

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

export function getConfig(branch?: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require("dotenv").config({ path: resolve(__dirname, "..", "..", "..", ".env") });

  const stages: Stage[] = [
    {
      branch: "master",
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      profile: process.env.PROFILE!,
      env: {
        account: process.env.ACCOUNT_ID!,
        region: process.env.REGION!
        /* eslint-enable @typescript-eslint/no-non-null-assertion */
      }
    }
  ];

  return GET_CONFIG(stages, staticProps)(branch);
}
