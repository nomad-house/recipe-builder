import { getLocalGitBranch } from "./lib/getLocalGitBranch";
import { toKebab } from "./lib/changeCase";

const owner = "matthewkeil";
const repo = "CODEified";
const rootDomain = "codeified.org";
const project = repo.toLowerCase();
const client = owner;
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

export async function getConfig(): Promise<ApplicationConfig> {
  let branch: string;
  // pipeline deploys don't have git command available
  if (process.env.BRANCH) {
    branch = process.env.BRANCH;
  } else {
    branch = await getLocalGitBranch();
  }
  if (!branch) {
    throw new Error("couldn't determine what branch to deploy");
  }

  const config = stages.find(stage => stage.branch === branch) || stages[0];
  return {
    ...config,
    owner,
    repo,
    project,
    client,
    rootDomain,
    stage: toKebab(branch === "master" ? "prod" : branch)
  };
}

interface StageConfig {
  env: {
    account: string;
    region: string;
  };
  profile: string;
  branch: string;
}

interface ApplicationConfig extends StageConfig {
  project: string;
  repo: string;
  owner: string;
  client: string;
  rootDomain: string;
  stage: string;
}
