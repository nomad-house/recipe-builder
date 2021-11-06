//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

enum VoteResult {
    Private,
    Yay,
    Nay,
    Abstain
}

contract Vote is Ownable {
    address public issue;
    address public certifier;

    VoteResult private officialResult;
    VoteResult public result;

    bool public publicity;

    constructor(
        VoteResult _officialResult,
        bool _publicity,
        address _voter
        // address _issue
    ) {
        officialResult = _officialResult;
        setPublicity(_publicity);

        certifier = msg.sender;
        transferOwnership(_voter);
        // issue = _issue;
    }

    function setPublicity(bool _publicity) internal {
        publicity = _publicity;
        if (publicity) {
            result = officialResult;
        } else {
            result = VoteResult.Private;
        }
    }

    function changePublicity(bool _publicity) public onlyOwner {
        setPublicity(_publicity);
    }

    function getOfficialResult() public view returns (VoteResult) {
        require(msg.sender != issue, "Issue must getOfficialResult");
        return officialResult;
    }
}

// contract Issue {
//     string public name;
//     address public creator;
//     Vote[] private votes;
//     mapping(HowVoted => uint256) public results;

//     function vote(address voter, HowVoted howVoted) external {
//         require(msg.sender != voter, "May not certify own vote");
//         votes.push({

//         });
//     }
// }

// contract Voter {
//     address private owner;
//     uint32 private ssn;
//     mapping(address => Vote) private votes;
// }
