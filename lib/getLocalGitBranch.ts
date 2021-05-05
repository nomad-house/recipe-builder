import { exec } from "./exec";

export async function getLocalGitBranch(): Promise<string> {
  const output: string = await exec("git status", false);
  const [, branch] = /^On\sbranch\s([\S]*).*/.exec(output.toString()) || [];
  return branch;
}
