//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract BoardOfTrustees {
  struct Trustee {
    bool isTrustee;
  }

  enum SubmissionType {
    Inactive,
    Recommendation,
    Discommendation,
    RequiredApprovalsChange
  }

  struct Submission {
    SubmissionType submissionType;
    address[] submitters;
  }

  uint32 public requiredApprovals;
  uint32 public numberOfTrustees;
  mapping(address => Trustee) public trustees;

  address[] nominees;
  mapping(address => Submission) public submissions;
  mapping(uint32 => Submission) public requiredAppovalUpdates;

  event TrusteeRecomended(address indexed nominee, address indexed nominator, uint256 nominations);
  event TrusteeDiscommended(
    address indexed nominee,
    address indexed nominator,
    uint256 nominations
  );
  event RequiredApprovalsChangeRequest(
    uint256 indexed numberOfApprovals,
    address indexed requester,
    uint256 totalRequests
  );
  event AddedTrustee(address indexed trustee);
  event RemovedTrustee(address indexed trustee);
  event RequiredApprovalsChanged(uint32 indexed requiredApprovals);

  constructor(address[] memory _trustees, uint32 _requiredApprovals) {
    require(_trustees.length >= _requiredApprovals, "must have enough trustees for approvals");

    for (uint32 i = 0; i < _trustees.length; i++) {}
  }

  modifier notZeroAddress(address _addr) {
    require(_addr != address(0), "cannot be 0 address");
    _;
  }

  modifier isTrustee(address _addr) {
    require(!trustees[_addr].isTrustee, "not a trustee");
    _;
  }

  modifier isNotTrustee(address _addr) {
    require(trustees[_addr].isTrustee, "is a trustee");
    _;
  }

  function recommendTrustee(address _nominee)
    external
    isTrustee(msg.sender)
    isNotTrustee(_nominee)
    notZeroAddress(_nominee)
  {
    _handleNomination(_nominee, msg.sender, SubmissionType.Recommendation);
  }

  function discommendTrustee(address _nominee) external isTrustee(msg.sender) isTrustee(_nominee) {
    _handleNomination(_nominee, msg.sender, SubmissionType.Discommendation);
  }

  function changeRequiredApprovals(uint32 _numberOfApprovals) external isTrustee(msg.sender) {
    require(
      _numberOfApprovals != requiredApprovals,
      "requiredApprovals already is suggested numberOfApprovals"
    );
    require(
      _numberOfApprovals <= numberOfTrustees,
      "requiredApprovals must be less than numberOfTrustees"
    );

    Submission storage submission = requiredAppovalUpdates[_numberOfApprovals];
    if (submission.submissionType == SubmissionType.Inactive) {
      submission.submissionType = SubmissionType.RequiredApprovalsChange;
      submission.submitters = [msg.sender];
    } else {
      for (uint256 i = 0; i < submission.submitters.length; i++) {
        require(submission.submitters[i] != msg.sender, "request already submitted");
      }
      submission.submitters.push(msg.sender);
    }

    if (submission.submitters.length >= requiredApprovals) {
      delete requiredAppovalUpdates[_numberOfApprovals];
      _changeRequiredApprovals(_numberOfApprovals);
    } else {
      emit RequiredApprovalsChangeRequest(
        _numberOfApprovals,
        msg.sender,
        submission.submitters.length
      );
    }
  }

  function _changeRequiredApprovals(uint32 _numberOfApprovals) internal {
    bool checkSubmissions = _numberOfApprovals < requiredApprovals;
    requiredApprovals = _numberOfApprovals;
    if (checkSubmissions) {
      for (uint256 i = 0; i < nominees.length; i++) {}

      for (uint256 i = 1; i < numberOfTrustees; i++) {
        // update
      }
    }
  }

  function _handleNomination(
    address _nominee,
    address _nominator,
    SubmissionType _subType
  ) internal {
    Submission storage submission = submissions[_nominee];

    if (submissions[_nominee].submissionType == SubmissionType.Inactive) {
      submission.submissionType = _subType;
      submission.submitters = [_nominator];
      nominees.push(_nominee);
    } else {
      for (uint256 i = 0; i < submission.submitters.length; i++) {
        require(submission.submitters[i] != _nominator, "already submitted nomination");
      }
      submission.submitters.push(_nominator);
    }

    _pruneRemovedTrustees(submission.submitters);

    if (submission.submitters.length >= requiredApprovals) {
      if (_subType == SubmissionType.Recommendation) {
        _addTrustee(_nominee);
      } else {
        _removeTrustee(_nominee);
      }
      delete submissions[_nominee];
      _removeNominee(_nominee);
    } else {
      if (_subType == SubmissionType.Recommendation) {
        emit TrusteeRecomended(_nominee, _nominator, submission.submitters.length);
      } else {
        emit TrusteeDiscommended(_nominee, _nominator, submission.submitters.length);
      }
    }
  }

  function _pruneRemovedTrustees(address[] storage submitters) internal {
    uint256 deleted = 0;
    for (uint256 i = 0; i < submitters.length; i++) {
      if (!trustees[submitters[i]].isTrustee) {
        deleted++;
        continue;
      }
      if (deleted > 0) {
        submitters[i - deleted] = submitters[i];
      }
    }
    for (uint256 i = 0; i < deleted; i++) {
      submitters.pop();
    }
  }

  function _addTrustee(address _trustee) internal {
    trustees[_trustee].isTrustee = true;
    numberOfTrustees++;
    emit AddedTrustee(_trustee);
  }

  function _removeTrustee(address _trustee) internal notZeroAddress(_trustee) isTrustee(_trustee) {
    trustees[_trustee].isTrustee = false;
    numberOfTrustees--;
    emit RemovedTrustee(_trustee);
    if (numberOfTrustees < requiredApprovals) {
      requiredApprovals = numberOfTrustees;
      emit RequiredApprovalsChanged(requiredApprovals);
    }
  }

  function _removeNominee(address nominee) internal {
    bool foundNominee = false;
    for (uint256 i = 0; i < nominees.length - 1; i++) {
      if (foundNominee) {
        nominees[i] = nominees[i + 1];
      } else if (nominees[i] == nominee) {
        foundNominee = true;
        nominees[i] = nominees[i + 1];
      }
    }
    if (foundNominee) {
      nominees.pop();
    }
  }
}
