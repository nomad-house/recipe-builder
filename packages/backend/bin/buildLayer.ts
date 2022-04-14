import { resolve } from "path";
import { writeFile, mkdir } from "fs/promises";
import { exec } from "@recipe-builder/utils";

import originalPackageJson from "../package.json";

const OUTPUT_DIR = resolve(__dirname, "..", "dist", "layer", "nodejs");
const PACKAGE_JSON = resolve(OUTPUT_DIR, "package.json");

async function buildPackageJson(): Promise<void> {
  const newPackageJson: any = { ...originalPackageJson };
  delete (newPackageJson as any).scripts;
  delete (newPackageJson as any).devDependencies;
  delete (newPackageJson as any).jest;
  newPackageJson.name = `${newPackageJson.name}-layer`;
  newPackageJson.description = `Lambda layer for ${newPackageJson.name}`;
  await writeFile(PACKAGE_JSON, JSON.stringify(newPackageJson, undefined, 2));
}

export async function buildLayer(): Promise<void> {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await buildPackageJson();
  await exec(`cd ${OUTPUT_DIR} && npm i --only=prod --no-package-lock`);
}

if (require.main === module) {
  buildLayer();
}
