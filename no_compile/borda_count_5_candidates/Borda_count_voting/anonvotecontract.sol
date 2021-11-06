

pragma solidity ^0.4.3;

/**
 * @title ECCMath
 *
 * Functions for working with integers, curve-points, etc.
 *
 * @author Andreas Olofsson (androlo1980@gmail.com)
 */
library ECCMath {
    /// @dev Modular inverse of a (mod p) using euclid.
    /// "a" and "p" must be co-prime.
    /// @param a The number.
    /// @param p The mmodulus.
    /// @return x such that ax = 1 (mod p)
    function invmod(uint a, uint p) internal constant returns (uint) {
        if (a == 0 || a == p || p == 0)
            revert();
            //throw;
        if (a > p)
            a = a % p;
        int t1;
        int t2 = 1;
        uint r1 = p;
        uint r2 = a;
        uint q;
        while (r2 != 0) {
            q = r1 / r2;
            (t1, t2, r1, r2) = (t2, t1 - int(q) * t2, r2, r1 - q * r2);
        }
        if (t1 < 0)
            return (p - uint(-t1));
        return uint(t1);
    }

    /// @dev Modular exponentiation, b^e % m
    /// Basically the same as can be found here:
    /// https://github.com/ethereum/serpent/blob/develop/examples/ecc/modexp.se
    /// @param b The base.
    /// @param e The exponent.
    /// @param m The modulus.
    /// @return x such that x = b**e (mod m)
    function expmod(uint b, uint e, uint m) internal constant returns (uint r) {
        if (b == 0)
            return 0;
        if (e == 0)
            return 1;
        if (m == 0)
            revert();
            //throw;
        r = 1;
        uint bit = 2 ** 255;
        bit = bit;
        assembly {
            loop:
                jumpi(end, iszero(bit))
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, bit)))), m)
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, div(bit, 2))))), m)
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, div(bit, 4))))), m)
                r := mulmod(mulmod(r, r, m), exp(b, iszero(iszero(and(e, div(bit, 8))))), m)
                bit := div(bit, 16)
                jump(loop)
            end:
        }
    }

    /// @dev Converts a point (Px, Py, Pz) expressed in Jacobian coordinates to (Px", Py", 1).
    /// Mutates P.
    /// @param P The point.
    /// @param zInv The modular inverse of "Pz".
    /// @param z2Inv The square of zInv
    /// @param prime The prime modulus.
    /// @return (Px", Py", 1)
    function toZ1(uint[3] memory P, uint zInv, uint z2Inv, uint prime) internal constant {
        P[0] = mulmod(P[0], z2Inv, prime);
        P[1] = mulmod(P[1], mulmod(zInv, z2Inv, prime), prime);
        P[2] = 1;
    }

    /// @dev See _toZ1(uint[3], uint, uint).
    /// Warning: Computes a modular inverse.
    /// @param PJ The point.
    /// @param prime The prime modulus.
    /// @return (Px", Py", 1)
    function toZ1(uint[3] PJ, uint prime) internal constant {
        uint zInv = invmod(PJ[2], prime);
        uint zInv2 = mulmod(zInv, zInv, prime);
        PJ[0] = mulmod(PJ[0], zInv2, prime);
        PJ[1] = mulmod(PJ[1], mulmod(zInv, zInv2, prime), prime);
        PJ[2] = 1;
    }

}

library Secp256k1 {


    // Field size
    uint constant pp = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

    // Base point (generator) G
    uint constant Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
    uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;

    // Order of G
    uint constant nn = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

    // Cofactor
    // uint constant hh = 1;

    // Maximum value of s
    uint constant lowSmax = 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0;

    // For later
    // uint constant lambda = "0x5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72";
    // uint constant beta = "0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee";

    /// @dev See Curve.onCurve
    function onCurve(uint[2] P) internal constant returns (bool) {
        uint p = pp;
        if (0 == P[0] || P[0] == p || 0 == P[1] || P[1] == p)
            return false;
        uint LHS = mulmod(P[1], P[1], p);
        uint RHS = addmod(mulmod(mulmod(P[0], P[0], p), P[0], p), 7, p);
        return LHS == RHS;
    }

    /// @dev See Curve.isPubKey
    function isPubKey(uint[2] memory P) internal constant returns (bool isPK) {
        isPK = onCurve(P);
    }

    /// @dev See Curve.isPubKey
    function isPubKey(uint[3] memory P) internal constant returns (bool isPK) {
        uint[2] memory a_P;
        a_P[0] = P[0];
        a_P[1] = P[1];
        isPK = onCurve(a_P);
    }

    /// @dev See Curve.validateSignature
    function validateSignature(bytes32 message, uint[2] rs, uint[2] Q) internal constant returns (bool) {
        uint n = nn;
        uint p = pp;
        if(rs[0] == 0 || rs[0] >= n || rs[1] == 0 || rs[1] > lowSmax)
            return false;
        if (!isPubKey(Q))
            return false;

        uint sInv = ECCMath.invmod(rs[1], n);
        uint[3] memory u1G = _mul(mulmod(uint(message), sInv, n), [Gx, Gy]);
        uint[3] memory u2Q = _mul(mulmod(rs[0], sInv, n), Q);
        uint[3] memory P = _add(u1G, u2Q);

        if (P[2] == 0)
            return false;

        uint Px = ECCMath.invmod(P[2], p); // need Px/Pz^2
        Px = mulmod(P[0], mulmod(Px, Px, p), p);
        return Px % n == rs[0];
    }

    /// @dev See Curve.compress
    function compress(uint[2] P) internal constant returns (uint8 yBit, uint x) {
        x = P[0];
        yBit = P[1] & 1 == 1 ? 1 : 0;
    }

    /// @dev See Curve.decompress
    function decompress(uint8 yBit, uint x) internal constant returns (uint[2] P) {
        uint p = pp;
        var y2 = addmod(mulmod(x, mulmod(x, x, p), p), 7, p);
        var y_ = ECCMath.expmod(y2, (p + 1) / 4, p);
        uint cmp = yBit ^ y_ & 1;
        P[0] = x;
        P[1] = (cmp == 0) ? y_ : p - y_;
    }

    // Point addition, P + Q
    // inData: Px, Py, Pz, Qx, Qy, Qz
    // outData: Rx, Ry, Rz
    function _add(uint[3] memory P, uint[3] memory Q) internal constant returns (uint[3] memory R) {
        if(P[2] == 0)
            return Q;
        if(Q[2] == 0)
            return P;
        uint p = pp;
        uint[4] memory zs; // Pz^2, Pz^3, Qz^2, Qz^3
        zs[0] = mulmod(P[2], P[2], p);
        zs[1] = mulmod(P[2], zs[0], p);
        zs[2] = mulmod(Q[2], Q[2], p);
        zs[3] = mulmod(Q[2], zs[2], p);
        uint[4] memory us = [
            mulmod(P[0], zs[2], p),
            mulmod(P[1], zs[3], p),
            mulmod(Q[0], zs[0], p),
            mulmod(Q[1], zs[1], p)
        ]; // Pu, Ps, Qu, Qs
        if (us[0] == us[2]) {
            if (us[1] != us[3])
                return;
            else {
                return _double(P);
            }
        }
        uint h = addmod(us[2], p - us[0], p);
        uint r = addmod(us[3], p - us[1], p);
        uint h2 = mulmod(h, h, p);
        uint h3 = mulmod(h2, h, p);
        uint Rx = addmod(mulmod(r, r, p), p - h3, p);
        Rx = addmod(Rx, p - mulmod(2, mulmod(us[0], h2, p), p), p);
        R[0] = Rx;
        R[1] = mulmod(r, addmod(mulmod(us[0], h2, p), p - Rx, p), p);
        R[1] = addmod(R[1], p - mulmod(us[1], h3, p), p);
        R[2] = mulmod(h, mulmod(P[2], Q[2], p), p);
    }

    // Point addition, P + Q. P Jacobian, Q affine.
    // inData: Px, Py, Pz, Qx, Qy
    // outData: Rx, Ry, Rz
    function _addMixed(uint[3] memory P, uint[2] memory Q) internal constant returns (uint[3] memory R) {
        if(P[2] == 0)
            return [Q[0], Q[1], 1];
        if(Q[1] == 0)
            return P;
        uint p = pp;
        uint[2] memory zs; // Pz^2, Pz^3, Qz^2, Qz^3
        zs[0] = mulmod(P[2], P[2], p);
        zs[1] = mulmod(P[2], zs[0], p);
        uint[4] memory us = [
            P[0],
            P[1],
            mulmod(Q[0], zs[0], p),
            mulmod(Q[1], zs[1], p)
        ]; // Pu, Ps, Qu, Qs
        if (us[0] == us[2]) {
            if (us[1] != us[3]) {
                P[0] = 0;
                P[1] = 0;
                P[2] = 0;
                return;
            }
            else {
                _double(P);
                return;
            }
        }
        uint h = addmod(us[2], p - us[0], p);
        uint r = addmod(us[3], p - us[1], p);
        uint h2 = mulmod(h, h, p);
        uint h3 = mulmod(h2, h, p);
        uint Rx = addmod(mulmod(r, r, p), p - h3, p);
        Rx = addmod(Rx, p - mulmod(2, mulmod(us[0], h2, p), p), p);
        R[0] = Rx;
        R[1] = mulmod(r, addmod(mulmod(us[0], h2, p), p - Rx, p), p);
        R[1] = addmod(R[1], p - mulmod(us[1], h3, p), p);
        R[2] = mulmod(h, P[2], p);
    }

    // Same as addMixed but params are different and mutates P.
    function _addMixedM(uint[3] memory P, uint[2] memory Q) internal constant {
        if(P[1] == 0) {
            P[0] = Q[0];
            P[1] = Q[1];
            P[2] = 1;
            return;
        }
        if(Q[1] == 0)
            return;
        uint p = pp;
        uint[2] memory zs; // Pz^2, Pz^3, Qz^2, Qz^3
        zs[0] = mulmod(P[2], P[2], p);
        zs[1] = mulmod(P[2], zs[0], p);
        uint[4] memory us = [
            P[0],
            P[1],
            mulmod(Q[0], zs[0], p),
            mulmod(Q[1], zs[1], p)
        ]; // Pu, Ps, Qu, Qs
        if (us[0] == us[2]) {
            if (us[1] != us[3]) {
                P[0] = 0;
                P[1] = 0;
                P[2] = 0;
                return;
            }
            else {
                _doubleM(P);
                return;
            }
        }
        uint h = addmod(us[2], p - us[0], p);
        uint r = addmod(us[3], p - us[1], p);
        uint h2 = mulmod(h, h, p);
        uint h3 = mulmod(h2, h, p);
        uint Rx = addmod(mulmod(r, r, p), p - h3, p);
        Rx = addmod(Rx, p - mulmod(2, mulmod(us[0], h2, p), p), p);
        P[0] = Rx;
        P[1] = mulmod(r, addmod(mulmod(us[0], h2, p), p - Rx, p), p);
        P[1] = addmod(P[1], p - mulmod(us[1], h3, p), p);
        P[2] = mulmod(h, P[2], p);
    }

    // Point doubling, 2*P
    // Params: Px, Py, Pz
    // Not concerned about the 1 extra mulmod.
    function _double(uint[3] memory P) internal constant returns (uint[3] memory Q) {
        uint p = pp;
        if (P[2] == 0)
            return;
        uint Px = P[0];
        uint Py = P[1];
        uint Py2 = mulmod(Py, Py, p);
        uint s = mulmod(4, mulmod(Px, Py2, p), p);
        uint m = mulmod(3, mulmod(Px, Px, p), p);
        var Qx = addmod(mulmod(m, m, p), p - addmod(s, s, p), p);
        Q[0] = Qx;
        Q[1] = addmod(mulmod(m, addmod(s, p - Qx, p), p), p - mulmod(8, mulmod(Py2, Py2, p), p), p);
        Q[2] = mulmod(2, mulmod(Py, P[2], p), p);
    }

    // Same as double but mutates P and is internal only.
    function _doubleM(uint[3] memory P) internal constant {
        uint p = pp;
        if (P[2] == 0)
            return;
        uint Px = P[0];
        uint Py = P[1];
        uint Py2 = mulmod(Py, Py, p);
        uint s = mulmod(4, mulmod(Px, Py2, p), p);
        uint m = mulmod(3, mulmod(Px, Px, p), p);
        var PxTemp = addmod(mulmod(m, m, p), p - addmod(s, s, p), p);
        P[0] = PxTemp;
        P[1] = addmod(mulmod(m, addmod(s, p - PxTemp, p), p), p - mulmod(8, mulmod(Py2, Py2, p), p), p);
        P[2] = mulmod(2, mulmod(Py, P[2], p), p);
    }

    // Multiplication dP. P affine, wNAF: w=5
    // Params: d, Px, Py
    // Output: Jacobian Q
    function _mul(uint d, uint[2] memory P) internal constant returns (uint[3] memory Q) {
        uint p = pp;
        if (d == 0) 
            return;
        uint dwPtr; // points to array of NAF coefficients.
        uint i;

        // wNAF
        assembly
        {
                let dm := 0
                dwPtr := mload(0x40)
                mstore(0x40, add(dwPtr, 512)) // Should lower this.
            loop:
                jumpi(loop_end, iszero(d))
                jumpi(even, iszero(and(d, 1)))
                dm := mod(d, 32)
                mstore8(add(dwPtr, i), dm) // Don"t store as signed - convert when reading.
                d := add(sub(d, dm), mul(gt(dm, 16), 32))
            even:
                d := div(d, 2)
                i := add(i, 1)
                jump(loop)
            loop_end:
        }
        
        dwPtr = dwPtr;

        // Pre calculation
        uint[3][8] memory PREC; // P, 3P, 5P, 7P, 9P, 11P, 13P, 15P
        PREC[0] = [P[0], P[1], 1];
        var X = _double(PREC[0]);
        PREC[1] = _addMixed(X, P);
        PREC[2] = _add(X, PREC[1]);
        PREC[3] = _add(X, PREC[2]);
        PREC[4] = _add(X, PREC[3]);
        PREC[5] = _add(X, PREC[4]);
        PREC[6] = _add(X, PREC[5]);
        PREC[7] = _add(X, PREC[6]);

        uint[16] memory INV;
        INV[0] = PREC[1][2];                            // a1
        INV[1] = mulmod(PREC[2][2], INV[0], p);         // a2
        INV[2] = mulmod(PREC[3][2], INV[1], p);         // a3
        INV[3] = mulmod(PREC[4][2], INV[2], p);         // a4
        INV[4] = mulmod(PREC[5][2], INV[3], p);         // a5
        INV[5] = mulmod(PREC[6][2], INV[4], p);         // a6
        INV[6] = mulmod(PREC[7][2], INV[5], p);         // a7

        INV[7] = ECCMath.invmod(INV[6], p);             // a7inv
        INV[8] = INV[7];                                // aNinv (a7inv)

        INV[15] = mulmod(INV[5], INV[8], p);            // z7inv
        for(uint k = 6; k >= 2; k--) {                  // z6inv to z2inv
            INV[8] = mulmod(PREC[k + 1][2], INV[8], p);
            INV[8 + k] = mulmod(INV[k - 2], INV[8], p);
        }
        INV[9] = mulmod(PREC[2][2], INV[8], p);         // z1Inv
        for(k = 0; k < 7; k++) {
            ECCMath.toZ1(PREC[k + 1], INV[k + 9], mulmod(INV[k + 9], INV[k + 9], p), p);
        }

        // Mult loop
        while(i > 0) {
            uint dj;
            uint pIdx;
            i--;
            assembly {
                dj := byte(0, mload(add(dwPtr, i)))
            }
            _doubleM(Q);
            if (dj > 16) {
                pIdx = (31 - dj) / 2; // These are the "negative ones", so invert y.
                _addMixedM(Q, [PREC[pIdx][0], p - PREC[pIdx][1]]);
            }
            else if (dj > 0) {
                pIdx = (dj - 1) / 2;
                _addMixedM(Q, [PREC[pIdx][0], PREC[pIdx][1]]);
            }
        }
    }

}


contract owned {
    address public owner;

    /* Initialise contract creator as owner */
    function owned() {
        owner = msg.sender;
    }

    /* Function to dictate that only the designated owner can call a function */
	  modifier onlyOwner {
        if(owner != msg.sender) revert(); //throw;
        _;
    }

    /* Transfer ownership of this contract to someone else */
    function transferOwnership(address newOwner) onlyOwner() {
        owner = newOwner;
    }
}

/*
 * @title AnonymousVoteContract
 *  Decentralized Borda count voting
 *  A self-talling protocol that supports voter privacy.
 *
 */
contract AnonymousVoteContract is owned {

  // Modulus for public keys
  uint constant pp = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F;

  // Base point (generator) G
  uint constant Gx = 0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798;
  uint constant Gy = 0x483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8;

  // Modulus for private keys (sub-group)
  uint constant nn = 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141;

  uint[2] G;

  //Every address has an index
  //This makes looping in the program easier.
  address[] public addresses;
  mapping (address => uint) public addressid; // Address to Counter
  mapping (uint => Voter) public voters;
  mapping (address => bool) public eligible; // White list of addresses allowed to vote
  mapping (address => bool) public registered; // Address registered?
  mapping (address => bool) public votecast; // Address voted?
  mapping (address => bool) public commitment; // Have we received their commitment?
  mapping (address => uint) public refunds; // Have we received their commitment?

  struct Voter {
      address addr;
      uint[2][5] registeredkey;
      uint[2][5] reconstructedkey;
      bytes32[6] commitment;
      uint[2][5] vote;
      uint       sendtrx;
  }

  // Work around function to fetch details about a voter
  function getVoter() returns (/*uint[2][5] _registeredkey, uint[2][5] _reconstructedkey,*/uint[10] _registeredkey, uint[10] _reconstructedkey, bytes32[6] _commitment){
      uint index = addressid[msg.sender];
      uint i;
     for (i=0; i< 10; i ++) {
      _registeredkey[i] = voters[index].registeredkey[i/2][i%2];
      _reconstructedkey[i] = voters[index].reconstructedkey[i/2][i%2];
     }
      _commitment = voters[index].commitment;
  }

  // List of timers that each phase MUST end by an explicit time in UNIX timestamp.
  // Ethereum works in SECONDS. Not milliseconds.
  uint public finishSignupPhase; // Election Authority to transition to next phase.
  uint public endSignupPhase; // Election Authority does not transition to next phase by this time.
  uint public endCommitmentPhase; // Voters have not sent their commitments in by this time.
  uint public endVotingPhase; // Voters have not submitted their vote by this stage.
  uint public endRefundPhase; // Voters must claim their refund by this stage.

  uint public totalregistered; //Total number of participants that have submited a voting key
  uint public totaleligible;
  uint public totalcommitted;
  uint public totalvoted;
  uint public totalrefunded;
  uint public totaltorefund;

  string public question;
  uint[2][5] public finaltally; // Final tally
  uint public finaltallycomp;
  bool public commitmentphase; // OPTIONAL phase.
  uint public depositrequired;
  uint public gap; // Minimum amount of time between time stamps.
  address public charity;
  uint public totalcomponent;

  uint public lostdeposit; // This money is collected from non active voters...

  enum State { SETUP, REGISTRATION, COMMITMENT, VOTE, FINISHED }
  State public state;

  modifier inState(State s) {
    if(state != s) {
        revert();
        //throw;
    }
    _;
  }

  function AnonymousVoteContract(uint _gap, address _charity) {
    G[0] = Gx;
    G[1] = Gy;
    state = State.SETUP;
    question = "No question set";
    gap = _gap; // Minimum gap period between stages
    charity = _charity;
  }

  // Owner of contract sets a whitelist of addresses that are eligible to vote.
  function setEligible(address[] addr) onlyOwner {

    // We can only handle up 50 people at the moment.
    if(totaleligible > 50) {
       revert();
       //throw;
    }

    // Sign up the addresses
    for(uint i=0; i<addr.length; i++) {

      if(!eligible[addr[i]]) {
        eligible[addr[i]] = true;
        addresses.push(addr[i]);
        totaleligible += 1;
      }
    }
  }

  // Owner of contract declares that eligible addresses begin round 1 of the protocol
  // Time is the number of 'blocks' we must wait until we can move onto round 2.
  function beginSignUp(string _question, bool enableCommitmentPhase, uint _finishSignupPhase, uint _endSignupPhase, uint _endCommitmentPhase, uint _endVotingPhase, uint _endRefundPhase, uint _depositrequired) inState(State.SETUP) onlyOwner payable returns (bool){

    // We have lots of timers. let's explain each one
    // _finishSignUpPhase - Voters should be signed up before this timer

    // Voter is refunded if any of the timers expire:
    // _endSignUpPhase - Election Authority never finished sign up phase
    // _endCommitmentPhase - One or more voters did not send their commitments in time
    // _endVotingPhase - One or more voters did not send their votes in time
    // _endRefundPhase - Provide time for voters to get their money back.
    // Why is there no endTally? Because anyone can call it!

    // Represented in UNIX time...
    // Make sure 3 people are at least eligible to vote..
    // Deposit can be zero or more WEI
    if(_finishSignupPhase > 0 + gap && addresses.length >= 3 && _depositrequired >= 0) {

        // Ensure each time phase finishes in the future...
        // Ensure there is a gap of 'x time' between each phase.
        if(_endSignupPhase-gap < _finishSignupPhase) {
          return false;
        }

        // We need to check Commitment timestamps if phase is enabled.
        if(enableCommitmentPhase) {

          // Make sure there is a gap between 'end of registration' and 'end of commitment' phases.
          if(_endCommitmentPhase-gap < _endSignupPhase) {
            return false;
          }

          // Make sure there is a gap between 'end of commitment' and 'end of vote' phases.
          if(_endVotingPhase-gap < _endCommitmentPhase) {
            return false;
          }

        } else {

          // We have no commitment phase.
          // Make sure there is a gap between 'end of registration' and 'end of vote' phases.
          if(_endVotingPhase-gap < _endSignupPhase) {
            return false;
          }
        }

        // Provide time for people to get a refund once the voting phase has ended.
        if(_endRefundPhase-gap < _endVotingPhase) {
          return false;
        }


      // Require Election Authority to deposit ether.
      if(msg.value  != _depositrequired) {
        return false;
      }

      // Store the election authority's deposit
      // Note: This deposit is only lost if the
      // election authority does not begin the election
      // or call the tally function before the timers expire.
      refunds[msg.sender] = msg.value;

      // All time stamps are reasonable.
      // We can now begin the registration phase.
      state = State.REGISTRATION;

      // All timestamps should be in UNIX..
      finishSignupPhase = _finishSignupPhase;
      endSignupPhase = _endSignupPhase;
      endCommitmentPhase = _endCommitmentPhase;
      endVotingPhase = _endVotingPhase;
      endRefundPhase = _endRefundPhase;
      question = _question;
      commitmentphase = enableCommitmentPhase;
      depositrequired = _depositrequired; // Deposit required from all voters

      return true;
    }

    return false;
  }

  // This function determines if one of the deadlines have been missed
  // If a deadline has been missed - then we finish the election,
  // and allocate refunds to the correct people depending on the situation.
  function deadlinePassed() returns (bool){

      uint refund = 0;

      // Has the Election Authority missed the registration deadline?
      // Election Authority will forfeit his deposit.
      if(state == State.REGISTRATION && block.timestamp > endSignupPhase) {

         // Nothing to do. All voters are refunded.
         state = State.FINISHED;
         totaltorefund = totalregistered;

         // Election Authority forfeits his deposit...
         // If 3 or more voters had signed up...
         if(addresses.length >= 3) {
           // Election Authority forfeits deposit
           refund = refunds[owner];
           refunds[owner] = 0;
           lostdeposit = lostdeposit + refund;

         }
         return true;
      }

      // Has a voter failed to send their commitment?
      // Election Authority DOES NOT forgeit his deposit.
      if(state == State.COMMITMENT && block.timestamp > endCommitmentPhase) {

         // Check which voters have not sent their commitment
         for(uint i=0; i<totalregistered; i++) {

            // Voters forfeit their deposit if failed to send a commitment
            if(!commitment[voters[i].addr]) {
               refund = refunds[voters[i].addr];
               refunds[voters[i].addr] = 0;
               lostdeposit = lostdeposit + refund;
            } else {

              // We will need to refund this person.
              totaltorefund = totaltorefund + 1;
            }
         }

         state = State.FINISHED;
         return true;
      }

      // Has a voter failed to send in their vote?
      // Eletion Authority does NOT forfeit his deposit.
      if(state == State.VOTE && block.timestamp > endVotingPhase) {

         // Check which voters have not cast their vote
         for(i=0; i<totalregistered; i++) {

            // Voter forfeits deposit if they have not voted.
            if(!votecast[voters[i].addr]) {
              refund = refunds[voters[i].addr];
              refunds[voters[i].addr] = 0;
              lostdeposit = lostdeposit + refund;
            } else {

              // Lets make sure refund has not already been issued...
              if(refunds[voters[i].addr] > 0) {
                // We will need to refund this person.
                totaltorefund = totaltorefund + 1;
              }
            }
         }

         state = State.FINISHED;
         return true;
      }

      // Has the deadline passed for voters to claim their refund?
      // Only owner can call. Owner must be refunded (or forfeited).
      // Refund period is over or everyone has already been refunded.
      if(state == State.FINISHED && msg.sender == owner && refunds[owner] == 0 && (block.timestamp > endRefundPhase || totaltorefund == totalrefunded)) {

         // Collect all unclaimed refunds. We will send it to charity.
         for(i=0; i<totalregistered; i++) {
           refund = refunds[voters[i].addr];
           refunds[voters[i].addr] = 0;
           lostdeposit = lostdeposit + refund;
         }

         uint[2][5] memory empty;
         bytes32[6] memory empty1;

         for(i=0; i<addresses.length; i++) {
            address addr = addresses[i];
            eligible[addr] = false; // No longer eligible
            registered[addr] = false; // Remove voting registration
            voters[i] = Voter({addr: 0, registeredkey: empty, reconstructedkey: empty, vote: empty, commitment: empty1, sendtrx: 0});
            addressid[addr] = 0; // Remove index
            votecast[addr] = false; // Remove that vote was cast
            commitment[addr] = false;
         }

         // Reset timers.
         finishSignupPhase = 0;
         endSignupPhase = 0;
         endCommitmentPhase = 0;
         endVotingPhase = 0;
         endRefundPhase = 0;

         delete addresses;

         // Keep track of voter activity
         totalregistered = 0;
         totaleligible = 0;
         totalcommitted = 0;
         totalvoted = 0;

         // General values that need reset
         question = "No question set";
         finaltally[0][0] = 0;
         finaltally[0][1] = 0;
         finaltally[1][0] = 0;
         finaltally[1][1] = 0;
         finaltally[2][0] = 0;
         finaltally[2][1] = 0;
         finaltally[3][0] = 0;
         finaltally[3][1] = 0;
         finaltally[4][0] = 0;
         finaltally[4][1] = 0;
         finaltallycomp   = 0;
         commitmentphase = false;
         depositrequired = 0;
         totalrefunded = 0;
         totaltorefund = 0;
         totalcomponent = 0;

         state = State.SETUP;
         return true;
      }

      // No deadlines have passed...
      return false;
  }

  // Called by participants to register their voting public key
  // Participant mut be eligible, and can only register the first key sent key.
  function register(uint[2][5] xG, uint[3][5] vG, uint[5] r) inState(State.REGISTRATION) payable returns (bool) {

     // HARD DEADLINE
     if(block.timestamp > finishSignupPhase) {
       revert(); //throw; // throw returns the voter's ether, but exhausts their gas.
     }

    // Make sure the ether being deposited matches what we expect.
    if(msg.value != depositrequired) {
      return false;
    }

    // Only white-listed addresses can vote
    if(eligible[msg.sender]) {
        if(verifyZKP(xG,r,vG) && !registered[msg.sender]) {

            // Store deposit
            refunds[msg.sender] = msg.value;

            // Update voter's registration
            uint[2][5] memory empty;
            bytes32[6]    memory empty1;
            addressid[msg.sender] = totalregistered;
            voters[totalregistered] = Voter({addr: msg.sender, registeredkey: xG, reconstructedkey: empty, vote: empty, commitment: empty1, sendtrx: 0});
            registered[msg.sender] = true;
            totalregistered += 1;

            return true;
        }
    }

    return false;
  }



  // Timer has expired - we want to start computing the reconstructed keys
  function finishRegistrationPhase(uint comp) inState(State.REGISTRATION) onlyOwner returns(bool) {


      // Make sure at least 3 people have signed up...
      if(totalregistered < 3) {
        return;
      }

      if (comp > 4) {    
          return false;  
      }   


      // We can only compute the public keys once participants
      // have been given an opportunity to register their
      // voting public key.
      if(block.timestamp < finishSignupPhase) {
        return;
      }

      // Election Authority has a deadline to begin election
      if(block.timestamp > endSignupPhase) {
        return;
      }

      uint[2] memory temp;
      uint[3] memory yG;
      uint[3] memory beforei;
      uint[3] memory afteri;

      // Step 1 is to compute the index 1 reconstructed key
      afteri[0] = voters[1].registeredkey[comp][0];
      afteri[1] = voters[1].registeredkey[comp][1];
      afteri[2] = 1;

      for(uint i=2; i<totalregistered; i++) {
         Secp256k1._addMixedM(afteri, voters[i].registeredkey[comp]);
      }

      ECCMath.toZ1(afteri,pp);
       voters[0].reconstructedkey[comp][0] = afteri[0];
       voters[0].reconstructedkey[comp][1] = pp - afteri[1];

      // Step 2 is to add to beforei, and subtract from afteri.
     for(i=1; i<totalregistered; i++) {

       if(i==1) {
         beforei[0] = voters[0].registeredkey[comp][0];
         beforei[1] = voters[0].registeredkey[comp][1];
         beforei[2] = 1;
       } else {
         Secp256k1._addMixedM(beforei, voters[i-1].registeredkey[comp]);
       }

       // If we have reached the end... just store beforei
       // Otherwise, we need to compute a key.
       // Counting from 0 to n-1...
       if(i==(totalregistered-1)) {
         ECCMath.toZ1(beforei,pp);
          voters[i].reconstructedkey[comp][0] = beforei[0];
          voters[i].reconstructedkey[comp][1] = beforei[1];

       } else {

          // Subtract 'i' from afteri
          temp[0] = voters[i].registeredkey[comp][0];
          temp[1] = pp - voters[i].registeredkey[comp][1];

          // Grab negation of afteri (did not seem to work with Jacob co-ordinates)
          Secp256k1._addMixedM(afteri,temp);
          ECCMath.toZ1(afteri,pp);

          temp[0] = afteri[0];
          temp[1] = pp - afteri[1];

          // Now we do beforei - afteri...
          yG = Secp256k1._addMixed(beforei, temp);

          ECCMath.toZ1(yG,pp);

          voters[i].reconstructedkey[comp][0] = yG[0];
          voters[i].reconstructedkey[comp][1] = yG[1];
       }
     }
     totalcomponent |= (1<<comp);
      if (totalcomponent == 31) { /* 31 = (2^5-1) */ 
      // We have computed each voter's special voting key.
      // Now we either enter the commitment phase (option) or voting phase.
      if(commitmentphase) {
        state = State.COMMITMENT;
      } else {
        state = State.VOTE;
      }
      }
  }

  /*
   * OPTIONAL STAGE: All voters submit the hash of their vote.
   * Why? The final voter that submits their vote gets to see the tally result
   * before anyone else. This provides the voter with an additional advantage
   * compared to all other voters. To get around this issue; we can force all
   * voters to commit to their vote in advance.... and votes are only revealed
   * once all voters have committed. This way the final voter has no additional
   * advantage as they cannot change their vote depending on the tally.
   * However... we cannot enforce the pre-image to be a hash, and someone could
   * a commitment that is not a vote. This will break the election, but you
   * will be able to determine who did it (and possibly punish them!).
   */
  function submitCommitment(bytes32[6] h) inState(State.COMMITMENT) {

     //All voters have a deadline to send their commitment
     if(block.timestamp > endCommitmentPhase) {
       return;
     }

    if(!commitment[msg.sender]) {
        commitment[msg.sender] = true;
        uint index = addressid[msg.sender];
        voters[index].commitment = h;
        totalcommitted = totalcommitted + 1;

        // Once we have recorded all commitments... let voters vote!
        if(totalcommitted == totalregistered) {
          state = State.VOTE;
        }
    }
  }


  // Given the 1 out of k ZKP - record the users vote!
function submitVote(uint[20] ab, uint[20] xGyG, uint[10] params, uint comp) inState(State.VOTE) returns (bool) {
     // HARD DEADLINE
     if(block.timestamp > endVotingPhase) {
       return;
     }

     if (comp > 4) {    
         return false;  
     }   

     uint c = addressid[msg.sender];

     // Make sure the sender can vote, and hasn't already voted.
     if(registered[msg.sender] && !votecast[msg.sender]) {

       // OPTIONAL Phase: Voters need to commit to their vote in advance.
       // Time to verify if this vote matches the voter's previous commitment.
       if(commitmentphase) {

         // Voter has previously committed to the entire zero knowledge proof...

         if(voters[c].commitment[0] != sha256(msg.sender, voters[c].reconstructedkey, xGyG)) {
           return false; 
         }

         if(voters[c].commitment[comp+1] != sha256(msg.sender, params, ab)) {
            return false; 
         }
       }
       
       if(verify1outofkZKP(ab, xGyG, params, comp)) {
           voters[c].sendtrx |= (1<<comp);
          
       
       // Verify the ZKP for the vote being cast. 31 = (2^5 - 1)
       if(voters[c].sendtrx == 31) {
         voters[c].vote[0][0] = xGyG[2];
         voters[c].vote[0][1] = xGyG[3];
         voters[c].vote[1][0] = xGyG[6];
         voters[c].vote[1][1] = xGyG[7];
         voters[c].vote[2][0] = xGyG[10];
         voters[c].vote[2][1] = xGyG[11];
         voters[c].vote[3][0] = xGyG[14];
         voters[c].vote[3][1] = xGyG[15];
         voters[c].vote[4][0] = xGyG[18];
         voters[c].vote[4][1] = xGyG[19];
         
            
         votecast[msg.sender] = true;

         totalvoted += 1;

         // Refund the sender their ether..
         // Voter has finished their part of the protocol...
         uint refund = refunds[msg.sender];
         refunds[msg.sender] = 0;

         // We can still fail... Safety first.
         // If failed... voter can call withdrawRefund()
         // to collect their money once the election has finished.
         if (!msg.sender.send(refund)) {
            refunds[msg.sender] = refund;
         }

         return true;
       }
         return true;
       }
     }

     // Either vote has already been cast, or ZKP verification failed.
     return false;
  }
  
  // Assuming all votes have been submitted. We can leak the tally.
  // We assume Election Authority performs this function. It could be anyone.
  // Election Authority gets deposit upon tallying.
  function computeTally(uint comp) inState(State.VOTE) onlyOwner {

     if (comp > 4) {    
         return;  
     }   

     uint[3] memory temp;
     uint[2] memory vote;
     uint refund;

     
     // Sum all votes
     for(uint i=0; i<totalregistered; i++) {

         // Confirm all votes have been cast...
         if(!votecast[voters[i].addr]) {
            revert(); //throw;
         }

         vote = voters[i].vote[comp];

         if(i==0) {
           temp[0] = vote[0];
           temp[1] = vote[1];
           temp[2] = 1;
         } else {
             Secp256k1._addMixedM(temp, vote);
         }
     }
     finaltallycomp |= (1<<comp);
     if (finaltallycomp == 31) { /* 31 = (2^5-1) */ 
         // All votes have been accounted for...
         // Get tally, and change state to 'Finished'
         state = State.FINISHED;
     

         // All voters should already be refunded!
         for(i = 0; i<totalregistered; i++) {

             // Sanity check.. make sure refunds have been issued..
             if(refunds[voters[i].addr] > 0) {
                 totaltorefund = totaltorefund + 1;
             }
         }
     }

     // Each vote is represented by a G.
     // If there are no votes... then it is 0G = (0,0)...
     if(temp[0] == 0) {
       finaltally[comp][0] = 0;
       finaltally[comp][1] = totalregistered;

       if (finaltallycomp == 31) {
       // Election Authority is responsible for calling this....
       // He should not fail his own refund...
       // Make sure tally is computed before refunding...
       refund = refunds[msg.sender];
       refunds[msg.sender] = 0;

       if (!msg.sender.send(refund)) {
          refunds[msg.sender] = refund;
       }
       }
       return;
     } else {

       // There must be a vote. So lets
       // start adding 'G' until we
       // find the result.
       ECCMath.toZ1(temp,pp);
       uint[3] memory tempG;
       tempG[0] = G[0];
       tempG[1] = G[1];
       tempG[2] = 1;

       uint totalregistered_1 = 5 * totalregistered;
       // Start adding 'G' and looking for a match
       for(i=1; i<=totalregistered_1; i++) {

         if(temp[0] == tempG[0]) {
             finaltally[comp][0] = i;
             finaltally[comp][1] = totalregistered;

             // Election Authority is responsible for calling this....
             // He should not fail his own refund...
             // Make sure tally is computed before refunding...
             if (finaltallycomp == 31) {
             refund = refunds[msg.sender];
             refunds[msg.sender] = 0;

             if (!msg.sender.send(refund)) {
                refunds[msg.sender] = refund;
             }
             }
             return;
         }

         // If something bad happens and we cannot find the Tally
         // Then this 'addition' will be run 1 extra time due to how
         // we have structured the for loop.
         Secp256k1._addMixedM(tempG, G);
           ECCMath.toZ1(tempG,pp);
       }

         // Something bad happened. /We should never get here....
         // This represents an error message... best telling people
         // As we cannot recover from it anyway.
         finaltally[comp][0] = 0;
         finaltally[comp][1] = 0;
         finaltallycomp = 0;

         // Election Authority is responsible for calling this....
         // He should not fail his own refund...
         refund = refunds[msg.sender];
         refunds[msg.sender] = 0;

         if (!msg.sender.send(refund)) {
            refunds[msg.sender] = refund;
         }
         return;
      }
  }

  // There are two reasons why we might be in a finished state
  // 1. The tally has been computed
  // 2. A deadline has been missed.
  // In the former; everyone gets a refund. In the latter; only active participants get a refund
  // We can assume if the deadline has been missed - then refunds has ALREADY been updated to
  // take that into account. (a transaction is required to indicate a deadline has been missed
  // and in that transaction - we can penalise the non-active participants. lazy sods!)
  function withdrawRefund() inState(State.FINISHED){

    uint refund = refunds[msg.sender];
    refunds[msg.sender] = 0;

    if (!msg.sender.send(refund)) {
       refunds[msg.sender] = refund;
    } else {

      // Tell everyone we have issued the refund.
      // Owner is not included in refund counter.
      // This is OK - we cannot reset election until
      // the owner has been refunded...
      // Counter only concerns voters!
      if(msg.sender != owner) {
         totalrefunded = totalrefunded + 1;
      }
    }
  }

  // Send the lost deposits to a charity. Anyone can call it.
  // Lost Deposit increments for each failed election. It is only
  // reset upon sending to the charity!
  function sendToCharity() {

    // Only send this money to the owner
    uint profit = lostdeposit;
    lostdeposit = 0;

    // Try to send money
    if(!charity.send(profit)) {

      // We failed to send the money. Record it again.
      lostdeposit = profit;
    }
  }

  // Parameters xG, r where r = v - xc, and vG.
  // Verify that vG = rG + xcG!
  function verifyZKP(uint[2][5] xG, uint[5] r, uint[3][5] vG) returns (bool){
      uint[2] memory G;
      G[0] = Gx;
      G[1] = Gy;
      uint[2] memory xGG;
      uint[3] memory vGG;
      uint i;

      for (i=0; i<5; i++) {
          xGG[0] = xG[i][0];
          xGG[1] = xG[i][1];
          vGG[0] = vG[i][0];
          vGG[1] = vG[i][1];
          vGG[2] = vG[i][2];

          // Check both keys are on the curve.
          if(!Secp256k1.isPubKey(xGG) || !Secp256k1.isPubKey(vGG)) {
              return false; //Must be on the curve!
          }

          // Get c = H(g, g^{x}, g^{v});
          bytes32 b_c = sha256(msg.sender, Gx, Gy, xGG, vGG);
          uint c = uint(b_c);

          // Get g^{r}, and g^{xc}
          uint[3] memory rG = Secp256k1._mul(r[i], G);
          uint[3] memory xcG = Secp256k1._mul(c, xGG);

          // Add both points together
          uint[3] memory rGxcG = Secp256k1._add(rG,xcG);

          // Convert to Affine Co-ordinates
          ECCMath.toZ1(rGxcG, pp);

          // Verify. Do they match?
          if(rGxcG[0] == vG[i][0] && rGxcG[1] == vG[i][1]) {
              if (i==4) {
                  return true;
              }
          } else {
              return false;
          }
      }
  }

  // a - b = c;
  function submod(uint a, uint b) returns (uint){
      uint a_nn;

      if(a>b) {
        a_nn = a;
      } else {
        a_nn = a+nn;
      }

      uint c = addmod(a_nn - b,0,nn);

      return c;
  }

  // We verify the 1-out-of-k ZKP used in the Borda count voting protocol.
function verify1outofkZKP(uint[20] ab, uint[20] xGyG, uint[10] params, uint comp) returns (bool) {
      uint k;      
      uint[2] memory temp1;
      uint[3] memory temp2;
      uint[3] memory temp3;
  
      
      // Voter Index
      uint[3] memory i; 
      i[0] = addressid[msg.sender];
      
      // We already have them stored...
      uint[2][5] memory yG = voters[i[0]].reconstructedkey; 
      uint[2][5] memory xG = voters[i[0]].registeredkey;    
  
      if (comp > 4) {    
          return false;  
      }                 
 

      if (comp == 0) {   
      for (k=0; k<5; k++) {
          temp1[0] = xGyG[k*4 + 0];
          temp1[1] = xGyG[k*4 + 1];
          if(!Secp256k1.isPubKey(temp1)) {
              return false;
          }
          temp1[0] = xGyG[k*4 + 2];
          temp1[1] = xGyG[k*4 + 3];
          if(!Secp256k1.isPubKey(temp1)) {
              return false;
          }
          temp1[0] = xG[k][0];
          temp1[1] = xG[k][1];
          if(!Secp256k1.isPubKey(temp1)) {
              return false;
          }
          temp1[0] = yG[k][0];
          temp1[1] = yG[k][1];

          if(!Secp256k1.isPubKey(temp1)) {
              return false;
          }
      }
      } 
          for (k=0; k<5; k++) {
              temp1[0] = ab[k*4 + 0];
              temp1[1] = ab[k*4 + 1];
              if(!Secp256k1.isPubKey(temp1)) {
                   //params1[20 + k*2 + 0] = 25 + j;
                   return false;
              }
              temp1[0] = ab[k*4 + 2];
              temp1[1] = ab[k*4 + 3];
              if (!Secp256k1.isPubKey(temp1)) {
                  //params1[20 + k*2 + 1] = 25 + j;
                  return false;
              }
          }
          
          // Does c =? d1 + d2 (mod n)
          k = addmod(params[0],addmod(params[1],params[2],nn),nn);
          if(uint(sha256(msg.sender, xGyG, ab)) != addmod(k,addmod(params[3],params[4],nn),nn)) {
              return false;
          }

              if ((5 - comp) == 2) {   
                  temp3[0] = G[0];    
                  temp3[1] = G[1];   
                  temp3[2] = 1;     
                  temp3 = Secp256k1._double(temp3);  
              } else if ((comp & 1) == 1) {   
                  temp3 = Secp256k1._mul((uint)(5 - comp - 1), G);  
                  temp3 = Secp256k1._addMixed(temp3, G);  
              } else {   //N2
                  temp3 = Secp256k1._mul((uint)(5 - comp), G);  
              }  
              ECCMath.toZ1(temp3, pp); 
              i[1] = temp3[0];  
              i[2] = pp - temp3[1]; 


          for (k=0; k<5; k++) {
              // a1 =? g^{r1} * x^{d1}
              temp2 = Secp256k1._mul(params[k + 5], G);
              temp3 = Secp256k1._add(temp2, Secp256k1._mul(params[k + 0], xG[k]));
              ECCMath.toZ1(temp3, pp);
              if((ab[k*4 + 0] != temp3[0]) || (ab[k*4 + 1] != temp3[1])) {
                  return false;
              }
              
                //b1 =? h^{r1} * y^{d1} (temp = affine 'y')
              temp3[0] = i[1];   
              temp3[1] = i[2];    
              temp3[2] = 1;
              // y-g
              temp1[0] = xGyG[k*4 + 2];
              temp1[1] = xGyG[k*4 + 3];             
              temp3 = Secp256k1._addMixed(temp3,temp1);
              ECCMath.toZ1(temp3, pp);
              temp1[0] = temp3[0];
              temp1[1] = temp3[1];
              temp2 = Secp256k1._mul(params[k + 5],yG[k]);
              temp3 = Secp256k1._add(temp2, Secp256k1._mul(params[k + 0], temp1));
              ECCMath.toZ1(temp3, pp);

              if(ab[k*4 + 2] != temp3[0] || ab[k*4 + 3] != temp3[1]) {
                  return false;
              }
          }
      return true;
    }
}

