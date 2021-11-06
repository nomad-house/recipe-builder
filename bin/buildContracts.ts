import { resolve } from "path";
import {existsSync} from 'fs'
 import { rm, mkdir, readdir, writeFile } from "fs/promises";
import { ethers, run } from "hardhat";

const ROOT_DIR = resolve(__dirname, "..");
const CONTRACTS_DIR = resolve(ROOT_DIR, "solidity","contracts");
const DIST = resolve(ROOT_DIR, "dist");
const CONTRACT_OUTPUT = resolve(DIST, "contracts");

async function buildFolders() {
    if (!existsSync(DIST)) {
        await mkdir(DIST);
    }
    if (existsSync(CONTRACT_OUTPUT)) {
        await rm(CONTRACT_OUTPUT, { recursive: true });
    }
    await mkdir(CONTRACT_OUTPUT);
}

async function getContracts() {}

export async function buildContracts() {
  run("compile");

const 
//   for (const contract of ethers.) {}

  await writeFile(
    resolve(__dirname, "..", "backend", "Vote.json"),
    JSON.stringify({
      abi: JSON.parse(vote.interface.format("json") as string),
      address: vote.address,
      voterAddress: voter.address,
      certifierAddress: certifier.address,
    })
  );
}
