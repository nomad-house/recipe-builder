import { resolve } from "path";
import { writeFile } from "fs/promises";
import { ethers } from "hardhat";

export async function deploy() {
  const [voter, certifier] = await ethers.getSigners();
  const Vote = await ethers.getContractFactory("Vote", certifier);
  const vote = await Vote.deploy(VoteResult.Yay, true, voter.address);

  await vote.deployed();

  voter.s();
}

if (require.main === module) {
  deploy();
}
