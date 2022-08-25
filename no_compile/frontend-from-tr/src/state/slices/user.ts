import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";

import type { TrState } from "../store";
import { configActions } from "./config";

const initialState = {
  roles: [] as string[],
  jwtToken: undefined as undefined | string
};
export type AuthState = typeof initialState;

function intToHex(int: number) {
  return int.toString(16).padStart(2, "0");
}

function getRandomString(lengthInBytes: number) {
  const randomValues = new Uint8Array(lengthInBytes);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues).map(intToHex).join("");
}

async function attemptLogin(address: string): Promise<CognitoUser | any> {
  try {
    const cognitoUser = await Auth.signIn(address);
    return cognitoUser;
  } catch (err) {
    if (err instanceof Error && err.message.includes("TR_ADDRESS_NOT_FOUND")) {
      console.log(`new user: ${address}`);
      const params = {
        username: address,
        password: getRandomString(30)
      };
      await Auth.signUp(params).catch(console.error);
      return attemptLogin(address);
    } else {
      console.log(err);
      throw err;
    }
  }
}

const logout = createAsyncThunk("user/logout", async (_, { dispatch, getState }) => {
  await Auth.signOut();
  await Auth.currentAuthenticatedUser();
});

const login = createAsyncThunk("user/login", async (_, { dispatch, getState }) => {
  const state = getState() as TrState;

  const { participantAddress } = state.web3;
  if (!participantAddress) {
    throw new Error("initialize web3 before attempting to login");
  }
  console.log({ participantAddress });

  const user = await attemptLogin(participantAddress);
  console.log({ attemptLogin: user });
  const messageToSign = user.challengeParam.message;
  if (!messageToSign) {
    throw new Error("no challenge parameter to sign");
  }

  const signature = await (window as any).ethereum.request({
    method: "personal_sign",
    params: [participantAddress, messageToSign]
  });
  await Auth.sendCustomChallengeAnswer(user, signature).catch((err) => {
    console.error("error sending challenge answer", err);
  });
  const verified = await Auth.currentAuthenticatedUser();
  console.log({ verified: user });

  const session = verified.signInUserSession ?? {};
  const { payload, jwtToken: idJwt } = session.idToken ?? {};
  const { jwtToken } = session.accessToken ?? {};
  const roles = payload["tr:roles"]?.split(",");

  const region = state.config.aws.region;

  const credProps = {
    clientConfig: { region },
    identityPoolId: state.config.aws.cognito.identityPoolId,
    logins: {
      [`cognito-idp.${region}.amazonaws.com/${state.config.aws.cognito.userPoolId}`]: idJwt
    }
  };

  dispatch(configActions.updateAwsCredProps(JSON.stringify(credProps)));

  return {
    roles,
    jwtToken
  };
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      state = action.payload;
    });
  }
});

export default userSlice;

export const userActions = {
  login,
  logout,
  ...userSlice.actions
};

export const userSelectors = {
  isLoggedIn: () => (state: TrState) => !!state.user.jwtToken?.length,
  roles: () => (state: TrState) => state.user.roles
};
