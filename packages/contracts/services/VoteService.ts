import { Vote, Vote__factory } from "../typechain";
import { ContractService, ContractServiceProps } from "./ContractService";

export enum VoteResult {
  Private,
  Yay,
  Nay,
  Abstain
}
interface VoteServiceProps extends ContractServiceProps {
  voteAddress: string;
  voterAddress: string;
}
export class VoteService extends ContractService {
  private vote!: Promise<Vote>;

  constructor(props: VoteServiceProps) {
    super(props);
    // this.provider.then((provider) => {
    this.getSigner().then(() => {
      console.log(Vote__factory);
    });
    //   this.vote = new Promise<Vote>((resolve, reject) => {
    //     ethers
    //       .getContractAt("Vote", voteAddress, signer)
    //       .then((vote) => resolve(vote))
    //       .catch(reject);
    //   });
    // });
  }

  async updateVote() {
    const vote = await this.vote;
    const response = await vote.changePublicity(true);
    console.log(response);
  }
}
