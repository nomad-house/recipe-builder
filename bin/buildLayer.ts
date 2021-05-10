import { resolve } from "path";
import { promises } from "fs";
import { exec } from "../lib/exec";

async function buildFolders(folders: string[]): Promise<void> {
  for (const folder of folders) {
    try {
      await promises.stat(folder);
    } catch {
      await promises.mkdir(folder);
    }
  }
}

async function buildPackage(pkg: any, outDir: string): Promise<void> {
  await promises.writeFile(
    resolve(outDir, "package.json"),
    JSON.stringify({
      ...pkg,
      name: pkg.name + "-layer",
      description: "layer for " + pkg.name,
      scripts: undefined,
      devDependencies: undefined
    })
  );
}

export async function buildLayer({
  pkgJsonPath,
  pathToDist = resolve(__dirname, "..", "dist")
}: {
  pkgJsonPath: string;
  pathToDist?: string;
}): Promise<void> {
  const pkgPath = pkgJsonPath.endsWith("package.json")
    ? pkgJsonPath
    : resolve(pkgJsonPath, "package.json");
  const pkg = require(pkgPath);
  const folders = [
    pathToDist,
    resolve(pathToDist, "layer"),
    resolve(pathToDist, "layer", "nodejs")
  ];
  const outputDir = folders[folders.length - 1];
  await buildFolders(folders);
  await buildPackage(pkg, outputDir);
  await exec(`cd ${outputDir} && npm i --only=prod --no-package-lock`);
}

buildLayer({ pkgJsonPath: resolve(__dirname, "..", "backend") });
