import { resolve } from "path";
import { promises } from "fs";
import pkg from "../backend/package.json";
import { exec } from "../lib/exec";

const folders = [
  resolve(__dirname, "..", "dist"),
  resolve(__dirname, "..", "dist", "backend"),
  resolve(__dirname, "..", "dist", "backend", "lambdaLayer"),
  resolve(__dirname, "..", "dist", "backend", "lambdaLayer", "nodejs")
];

async function buildFolders(): Promise<void> {
  for (const folder of folders) {
    try {
      await promises.stat(folder);
    } catch {
      await promises.mkdir(folder);
    }
  }
}

async function buildPackage(): Promise<void> {
  await promises.writeFile(
    resolve(folders[3], "package.json"),
    JSON.stringify({
      ...pkg,
      name: pkg.name + "-layer",
      description: "layer for " + pkg.name,
      scripts: undefined,
      devDependencies: undefined
    })
  );
}

async function buildLayer(): Promise<void> {
  await buildFolders();
  await buildPackage();
  await exec(`cd ${folders[3]} && npm i --only=prod --no-package-lock`);
}

buildLayer();
