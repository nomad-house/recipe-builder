import { EventDetails } from "./EventList/EventList.types";
import { TransactionMeta } from "./TransactionList/TransactionList.types";

const a = "0xec30d02f10353f8efc9601371f56e808751f396f";
const b = "0x738cf6903e6c4e699d1c2dd9ab8b67fcdb3121ea";
const c = "0x480c59788a72828b77f8784d04b1e0f7d9ddadcd";
const d = "0xb31f8caff7eb5775a094906bb5dc7d68ae12502b";
const e = "0xf16e9b0d03470827a95cdfd0cb8a8a3b46969b91";

export const events: EventDetails[] = [
  {
    participant: a,
    counterParty: b,
    ipfs: {
      cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD121",
      body: {
        type: "REQUEST_COTTON_TESTING",
        lotNumber: "12345ThatIsTheNumberToMyLuggage",
        sampleQty: 12,
        sampleToBeTested: 2
      }
    }
  },
  {
    highlight: true,
    participant: b,
    counterParty: a,
    ipfs: {
      cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD121",
      body: {
        type: "ACCEPT_COTTON_TESTING_REQUEST",
        lotNumber: "12345ThatIsTheNumberToMyLuggage",
        timeToComplete: "2 week(s)"
      }
    }
  },
  {
    highlight: true,
    participant: b,
    counterParty: a,
    ipfs: {
      cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD121",
      body: {
        type: "ANNOUNCE_COTTON_TESTING_RESULTS",
        lotNumber: "12345ThatIsTheNumberToMyLuggage",
        samplesTested: 2,
        results: "NOT from Xinjiang"
      }
    }
  },
  {
    participant: a,
    ipfs: {
      cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD121",
      body: {
        type: "ANNOUNCE_COTTON_TESTING_RESULTS",
        lotNumber: "12345ThatIsTheNumberToMyLuggage",
        contested: false
      }
    }
  }
];

export const transactions: TransactionMeta[] = [
  {
    cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD121",
    data: "0x2d2da806000000000000000000000000480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    from: "0x480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    hash: "0xbfbaf1f742eb0cdee1f6d69274f9c63667827f46be8f6d96c42b7e131cde0fc3",
    chain: "rinkeby"
  },
  {
    cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD122",
    data: "0x2d2da806000000000000000000000000480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    from: "0x480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    hash: "0x9642474f54b8c58f0ae300e9d80ae6863ccbac55159eca7099c32a370ca52c1b",
    chain: "rinkeby"
  },
  {
    cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD123",
    data: "0x2d2da806000000000000000000000000480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    from: "0x480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    hash: "string",
    chain: "rinkeby"
  },
  {
    cid: "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDxkD124",
    data: "0x2d2da806000000000000000000000000480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    from: "0x480c59788a72828b77f8784d04b1e0f7d9ddadcd",
    hash: "string",
    chain: "rinkeby"
  }
];
