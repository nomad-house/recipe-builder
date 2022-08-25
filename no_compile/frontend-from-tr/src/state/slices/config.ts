import { createSlice, PayloadAction, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { IpfsConfig } from "@trusted-resources/contracts";
import Amplify from "aws-amplify";

import { getParameter } from "../utils/getParameter";
import type { TrState } from "../store";
import { web3Actions } from "./web3";

const defaultAwsCredentials = {
  accessKeyId: "AKIAQIAE5VQ74JRPQJ47",
  secretAccessKey: "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"
};
const initialState = {
  aws: {
    account: "360076829283",
    region: "us-east-1",
    bucketName: "",
    credentials: defaultAwsCredentials,
    credProps: "",
    cognito: {
      identityPoolId: "us-east-1:2dbeb522-a4b6-446e-a264-8acedd890049",
      userPoolId: "us-east-1_tenOt4y9G",
      userPoolClientId: "f3g0jmc0nuriecq9ilhrq72hl"
    }
  },
  ipfs: {
    projectId: "",
    projectSecret: "",
    config: {} as IpfsConfig
  },
  infura: {
    projectId: "",
    projectSecret: ""
  }
};
type ConfigState = typeof initialState;

const configSetup = createAsyncThunk("config/setup", async (_, { dispatch, getState }) => {
  let config: ConfigState;
  try {
    // this is the globally namespaces config export by the
    // script tag tag we append to the head below.  The script is built
    // at deploy time by the CICD with the infrastructure configuration

    // @ts-ignore
    config = window.CONFIG_FILE;

    // hack for now till cognito is turned on using wallet
    config.aws.credentials = defaultAwsCredentials;
  } catch {
    throw new Error("window.CONFIG_FILE not found. check '/config.js'");
  }

  Amplify.configure({
    Auth: {
      region: config.aws.region,
      userPoolId: config.aws.cognito.userPoolId,
      userPoolWebClientId: config.aws.cognito.userPoolClientId,
      authenticationFlowType: "CUSTOM_AUTH"
    }
  });

  return;
  const paramConfig = {
    ipfsProjectId: "/TR/Infura/IPFS/ProjectId",
    ipfsProjectSecret: "/TR/Infura/IPFS/ProjectSecret",
    ethProjectId: "/TR/Infura/Ethereum/ProjectId",
    ethProjectSecret: "/TR/Infura/Ethereum/Secret"
  };
  type ParamKey = keyof typeof paramConfig;

  const promises = [] as [ParamKey, Promise<string>][];
  for (const [key, parameterName] of Object.entries(paramConfig)) {
    promises.push([
      key as ParamKey,
      getParameter({
        region: config.aws.region,
        parameterName,
        credentials: defaultAwsCredentials
      })
    ]);
  }

  // wait for all the promises async
  await Promise.all(promises.map(([, ssmPromise]) => ssmPromise));
  // then loop through with the await once they are all resolved
  const values = await Promise.all(
    promises.map(async ([key, ssmPromise]) => [key, await ssmPromise] as const)
  );

  for (const [key, value] of values) {
    switch (key) {
      case "ipfsProjectId":
        config.ipfs.projectId = value; // TODO:
        break;
      case "ipfsProjectSecret":
        config.ipfs.projectSecret = value; // TODO:
        break;
      case "ethProjectId":
        config.infura.projectId = value; // TODO:
        break;
      case "ethProjectSecret":
        config.infura.projectSecret = value; // TODO:
        break;
    }
  }

  dispatch(
    createAction<PayloadAction<ConfigState["aws"]>>("config/updateAwsConfig")(config.aws as any)
  );
  dispatch(
    createAction<PayloadAction<ConfigState["ipfs"]>>("config/updateIpfsConfig")(config.ipfs as any)
  );
  dispatch(
    createAction<PayloadAction<ConfigState["infura"]>>("config/updateInfuraConfig")(
      config.infura as any
    )
  );

  dispatch(web3Actions.web3Setup());
});

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    updateAwsCredProps: (state, { payload }: PayloadAction<string>) => {
      state.aws.credProps = payload;
    },
    updateAwsConfig: (state, { payload }: PayloadAction<Partial<ConfigState["aws"]>>) => {
      state.aws = { ...state.aws, ...payload };
    },
    updateIpfsConfig: (state, { payload }: PayloadAction<Partial<ConfigState["ipfs"]>>) => {
      const ipfs = { ...state.ipfs, ...payload };
      if (ipfs.projectId && ipfs.projectSecret) {
        ipfs.config = {
          ...ipfs.config,
          headers: {
            ...(ipfs.config.headers ?? {}),
            authorization:
              "Basic " + Buffer.from(ipfs.projectId + ":" + ipfs.projectSecret).toString("base64")
          }
        };
      }
      state.ipfs = ipfs;
    },
    updateInfuraConfig: (state, { payload }: PayloadAction<Partial<ConfigState["infura"]>>) => {
      state.infura = { ...state.infura, ...payload };
    }
  }
});
export default configSlice;

export const configActions = {
  configSetup,
  ...configSlice.actions
};

export const configSelectors = {
  getConfigAws: () => (state: TrState) => state.config.aws,
  getConfigIpfs: () => (state: TrState) => state.config.ipfs,
  getConfigInfura: () => (state: TrState) => state.config.infura
};
