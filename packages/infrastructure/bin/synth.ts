import { exec } from "@codeified/utils";
import { getConfig } from "../lib/getConfig";

export async function synth(): Promise<void> {
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

  await exec(`npm run cdk -- synth${_profile} --quiet`);
}

if (require.main === module) {
  synth();
}
