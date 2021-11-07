import { expect } from "chai";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Vote__factory } from "../typechain";
import { VoteResult } from "../services/types";

describe("Vote", function () {
  let Vote: Vote__factory;

  let voter: SignerWithAddress;
  let voterAddress: string;

  let certifier: SignerWithAddress;
  let certifierAddress: string;

  let unauthorizedUser: SignerWithAddress;

  before(async () => {
    [voter, certifier, unauthorizedUser] = await ethers.getSigners();
    voterAddress = await voter.getAddress();
    certifierAddress = await certifier.getAddress();
    Vote = await ethers.getContractFactory("Vote", certifier);
  });

  describe("constructor()", () => {
    it("Should deploy correctly", async function () {
      const vote = await Vote.deploy(VoteResult.Yay, true, voterAddress);
      await vote.deployed();
      expect(await vote.owner()).to.equal(voterAddress);
      expect(await vote.certifier()).to.equal(certifierAddress);
      expect(await vote.result()).to.equal(VoteResult.Yay);
    });
  });

  describe("voting publicity", () => {
    it("should allow public votes", async () => {
      const vote = await Vote.deploy(VoteResult.Yay, true, voterAddress);
      await vote.deployed();
      expect(await vote.result()).to.equal(VoteResult.Yay);
    });

    it("should allow private votes", async () => {
      const vote = await Vote.deploy(VoteResult.Yay, false, voterAddress);
      await vote.deployed();
      expect(await vote.result()).to.equal(VoteResult.Private);
    });

    it("should only allow voter to update publicity", async () => {
      const vote = await Vote.deploy(VoteResult.Yay, false, voterAddress);
      await vote.deployed();
      expect(await vote.result()).to.equal(VoteResult.Private);

      await vote.connect(voter).changePublicity(true);
      expect(await vote.result()).to.equal(VoteResult.Yay);

      await expect(vote.connect(unauthorizedUser).changePublicity(false)).to.be.revertedWith(
        "Ownable: caller is not the owner"
      );
    });
  });

  // it("Should build ", async function () {
  //   const greeter = await Vote.deploy(await voter.getAddress(), 0, true);
  //   await greeter.deployed();

  //   expect(await greeter.greet()).to.equal("Hello, world!");

  //   const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

  //   // wait until the transaction is mined
  //   await setGreetingTx.wait();

  //   expect(await greeter.greet()).to.equal("Hola, mundo!");
  // });
});
