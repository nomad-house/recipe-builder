import { resolve } from "path";
import { writeFile } from "fs/promises";
import { ethers } from "hardhat";
import { VoteResult } from "../contracts/types";

export async function deploy() {
  const [voter, certifier] = await ethers.getSigners();
  const Vote = await ethers.getContractFactory("Vote", certifier);
  const vote = await Vote.deploy(VoteResult.Yay, true, voter.address);

  await vote.deployed();

  await writeFile(
    resolve(__dirname, "..", "backend", "Vote.json"),
    JSON.stringify({
      abi: JSON.parse(vote.interface.format("json") as string),
      address: vote.address,
      voterAddress: voter.address,
      certifierAddress: certifier.address,
    })
  );
  console.log("Vote deployed to:", vote.address);
}

if (require.main === module) {
  deploy();
}
