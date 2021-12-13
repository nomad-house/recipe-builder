import { exec } from "@codeified/utils";
import { getConfig } from "@codeified/config";

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

  // eslint-disable-next-line no-process-exit
  await exec(`npm run cdk -- synth${_profile} --quiet`).catch(() => process.exit(1));
}

if (require.main === module) {
  synth();
}
