import { ethers } from "hardhat";
import { Vote } from "../../dist/typechain";

export class VoteService {
  private vote: Promise<Vote>;

  constructor(voteAddress: string, voterAddress: string) {
    const provider = window?.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");

    const signer = provider.getSigner(voterAddress);
    this.vote = new Promise<Vote>((resolve, reject) => {
      ethers
        .getContractAt("Vote", voteAddress, signer)
        .then(resolve)
        .catch(reject);
    });
  }

  async updateVote() {
    const vote = await this.vote;
    const response = await vote.changePublicity(true);
    console.log(response);
  }
}
