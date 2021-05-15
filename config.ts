import { getConfig as GET_CONFIG } from "nomad-cdk";

interface StageConfig {
  env: {
    account: string;
    region: string;
  };
  profile: string;
  branch: string;
}
const stages: StageConfig[] = [
  {
    profile: "admin",
    branch: "dev",
    env: {
      account: "141394433500",
      region: "us-east-1"
    }
  },
  {
    profile: "admin",
    branch: "master",
    env: {
      account: "141394433500",
      region: "us-east-1"
    }
  }
];

const repo = "CODEified";

export const getConfig = GET_CONFIG(stages, {
  owner: "matthewkeil",
  client: "matthewkeil",
  repo,
  rootDomain: "codeified.org",
  project: repo.toLowerCase()
});
