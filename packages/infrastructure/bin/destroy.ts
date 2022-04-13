import { exec } from "@recipe-builder/utils";
import { getConfig } from "@recipe-builder/config";

export async function destroy(): Promise<void> {
  const stackName: string = process.env.STACK || "--all";
  const { profile, branch } = await getConfig();

  let _profile = ` --profile ${profile}`;
  if (process.env.CICD === "true") {
    _profile = "";
  }

  // eslint-disable-next-line no-console
  console.log(`>>>
>>> Destroying '${branch}' branch that was deployed to ${profile}
>>> account using "${_profile === "" ? "default" : profile}" profile
>>>\n\n`);

  await exec(
    `npm run cdk -- destroy ${stackName} --force --no-rollback --require-approval never${_profile}`
    // eslint-disable-next-line no-process-exit
  ).catch(() => process.exit(1));
}

if (require.main === module) {
  destroy();
}
