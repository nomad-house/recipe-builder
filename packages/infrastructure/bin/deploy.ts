import { exec } from "@codeified/utils";
import { getConfig } from "../lib/getConfig";

export async function deploy(): Promise<void> {
  const stackName: string = process.env.STACK || "--all";
  const { profile, branch } = await getConfig();

  let _profile = ` --profile ${profile}`;
  if (process.env.CICD === "true") {
    _profile = "";
  }

  // eslint-disable-next-line no-console
  console.log(`>>>
>>> Synthesizing '${branch}' branch for deploy to ${profile} account
>>> Using profile ${_profile === "" ? "default" : profile}
>>>\n\n`);

  await exec(
    `npm run cdk -- deploy ${stackName} --no-rollback --require-approval never${_profile}`
  );
}

if (require.main === module) {
  deploy();
}
