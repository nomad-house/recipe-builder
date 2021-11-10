//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Ballot {
  struct Voter {
    uint256 weight;
    bool voted;
    address delegatedTo;
    address delegate;
    uint256 vote;
  }

  struct Proposal {
    bytes32 name;
    uint256 voteCount;
  }

  address public chairperson;

  mapping(address => Voter) public voters;

  mapping(address => address[]) public delegates;

  Proposal[] public proposals;

  event VoterDelegate(address voter, address delegatedTo, address delegate);
  event DelegateWeight(address voter, address delegatedTo, address delegate);

  constructor(bytes32[] memory proposalNames) {
    chairperson = msg.sender;
    voters[chairperson].weight = 1;

    for (uint256 i = 0; i < proposalNames.length; i++) {
      proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
    }
  }

  function getDelegate(address voterAddress) public {
    Voter storage voter = voters[voterAddress];
    if (voter.delegate != address(0)) {
      emit VoterDelegate(voterAddress, voter.delegatedTo, voter.delegate);
    } else {
      emit VoterDelegate(voterAddress, address(0), address(0));
    }
  }

  function giveRightToVote(address voter) public {
    require(msg.sender == chairperson, "Only the chairperson can give right to vote.");
    require(!voters[voter].voted, "Voter has already voted");
    require(voters[voter].weight == 0, "Voter has already been given the right to vote");
    voters[voter].weight = 1;
  }

  function vote(uint256 proposal) public {
    Voter storage sender = voters[msg.sender];
    require(sender.weight != 0, "Have no right to vote");
    require(!sender.voted, "Voter has already voted");
    sender.voted = true;
    sender.vote = proposal;
    proposals[proposal].voteCount += sender.weight;
  }

  function delegate(address _delegate) public {
    Voter storage sender = voters[msg.sender];
    require(!sender.voted, "Voter has already voted");
    require(_delegate != msg.sender, "Cannot delegate to self");

    sender.voted = true;
    sender.delegatedTo = _delegate;
    sender.delegate = _delegate;

    /**
     * if sender is already a delegate loop over delegate[sender]
     * and update constituent.delegate to _delegate. push constituent into
     * delegates[_delegate].
     *
     * then delete sender from from delegates
     *
     * if sender is not a delegate, push sender into delegates[_delegate]
     *
     *
     */

    if (delegates[_delegate].length != 0) {
      delegates[_delegate].push(msg.sender);
    } else {
      delegates[_delegate] = [msg.sender];
    }
  }
}
