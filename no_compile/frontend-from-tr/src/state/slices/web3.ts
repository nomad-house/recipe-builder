import { providers as EtherProviders } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";

import { S3 } from "@aws-sdk/client-s3";
import { createAction, createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import {
  ParticipantStatus,
  TrustedResourcesContract,
  // CleanupLogic,
  TrustedResourcesService,
  EventMeta,
  EventData
} from "@trusted-resources/contracts";
import type { TrState } from "../store";
import { userActions } from "./user";

let contract: undefined | TrustedResourcesContract;
// let cleanupLogic: CleanupLogic;
let service: undefined | TrustedResourcesService;

const chainIds: any = {
  1: "mainnet",
  3: "ropsten",
  4: "rinkeby",
  5: "goerli",
  42: "kovan",
  1337: "localhost"
};

export interface EventDetails extends EventMeta {
  body?: any;
  isUserEvent: boolean;
}
export interface FileMeta {
  cid: string;
  body: any;
  loading: boolean;
}
export interface TransactionMeta {
  hash: string;
  from: string;
  cid: string;
  data: string;
  chain: string;
}
const initialState = {
  contractAddress: undefined as string | undefined,
  participantAddress: undefined as string | undefined,
  participantStatus: "NONE" as ParticipantStatus,
  events: {} as { [cid: string]: EventDetails },
  files: {} as { [cid: string]: FileMeta },
  transactions: {} as { [txid: string]: TransactionMeta }
};

type CoreState = typeof initialState;

const web3Setup = createAsyncThunk("web3/web3Setup", async (_, { getState, dispatch }) => {
  if (!MetaMaskOnboarding.isMetaMaskInstalled()) {
    new MetaMaskOnboarding().startOnboarding();
    return;
  }

  // if (cleanupLogic) {
  // console.log("cleanup logic called");
  // remove listener if changing provider
  // cleanupLogic();
  // }

  const {
    config: { aws, ipfs }
  } = getState() as TrState;

  await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  const provider = new EtherProviders.Web3Provider((window as any).ethereum);
  const signed = provider.getSigner();
  const participantAddress = await signed.getAddress();

  contract = new TrustedResourcesContract({ signed });
  dispatch(
    createAction<PayloadAction<EventDetails>>("web3/setParticipantAddress")(
      participantAddress as any
    )
  );

  contract.onSingleParticipant((event) => {
    service?.getFileFromIpfs(event.cid).then((body) => {
      dispatch(
        createAction<PayloadAction<EventDetails>>("web3/addEvent")({ ...event, body } as any)
      );
    });
  });
  contract.onDualParticipant((event) => {
    service?.getFileFromIpfs(event.cid).then((body) => {
      dispatch(
        createAction<PayloadAction<EventDetails>>("web3/addEvent")({ ...event, body } as any)
      );
    });
  });

  // service = new TrustedResourcesService({
  //   contract: contract,
  //   s3: new S3({ region: aws.region, credentials: aws.credentials }),
  //   bucketName: aws.bucketName,
  //   ipfsConfig: ipfs.config
  // });

  dispatch(userActions.login());
});

const singleParticipant = createAsyncThunk(
  "web3/singlePartcipant",
  async ({ eventData }: { eventData: EventData }) => {
    if (!service) {
      throw new Error("Service not initialized");
    }
    const {
      cid,
      transaction: { data, from, hash, chainId }
    } = await service.singleParticipant({ eventData });

    return { cid, data, from, hash, chain: `${chainIds[chainId]}` };
  }
);

const dualParticipant = createAsyncThunk(
  "web3/dualPartcipant",
  async ({ counterParty, eventData }: { counterParty: string; eventData: EventData }) => {
    if (!service) {
      throw new Error("Service not initialized");
    }
    const {
      cid,
      transaction: { data, from, hash, chainId }
    } = await service.dualParticipant({ counterParty, eventData });

    return { cid, data, from, hash, chain: `${chainIds[chainId]}` };
  }
);

const web3Slice = createSlice({
  name: "web3",
  initialState,
  reducers: {
    setContractAddress: (state: CoreState, { payload }: PayloadAction<string | undefined>) => {
      state.contractAddress = payload;
    },
    setParticipantStatus: (state, { payload }: PayloadAction<ParticipantStatus>) => {
      state.participantStatus = payload;
    },
    setParticipantAddress: (state, { payload }: PayloadAction<string>) => {
      state.participantAddress = payload;
    },
    addEvent: (state, { payload }: PayloadAction<EventDetails>) => {
      if (payload.counterParty && payload.counterParty === state.participantAddress) {
        state.events[payload.cid] = {
          ...payload,
          isUserEvent: true
        };
      } else {
        state.events[payload.cid] = payload;
      }
    },
    addFileMeta: (state, { payload }: PayloadAction<FileMeta>) => {
      state.files[payload.cid] = payload;
    }
  },
  extraReducers(builder) {
    builder
      // .addCase(setup.fulfilled, (state, { payload }) => {})
      .addCase(singleParticipant.fulfilled, (state, { payload }) => {
        state.transactions[payload.hash] = payload;
      })
      .addCase(dualParticipant.fulfilled, (state, { payload }) => {
        state.transactions[payload.hash] = payload;
      });
  }
});
export default web3Slice;

export const web3Actions = {
  ...web3Slice.actions,
  web3Setup,
  singleParticipant,
  dualParticipant
};

export const web3Selectors = {
  participantAddress: () => (state: TrState) => state.web3.participantAddress,
  allEvents: () => (state: TrState) => state.web3.events,
  allTransactions: () => (state: TrState) => state.web3.transactions,
  allFiles: () => (state: TrState) => state.web3.files,
  getEventCount: () => (state: TrState) => state.web3.events.length,
  getEventByCid: (cid: string) => (state: TrState) => state.web3.events[cid],
  getIpfsFileByCid: (cid: string) => (state: TrState) => state.web3.files[cid]
};
