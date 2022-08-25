import {
  TypedUseSelectorHook,
  useDispatch as baseUseDispatch,
  useSelector as baseUseSelector
} from "react-redux";

import { configActions, configSelectors } from "./slices/config";
import { web3Actions, web3Selectors } from "./slices/web3";
import { userActions, userSelectors } from "./slices/user";
import type { TrDispatch, TrState } from "./store";
export type { TrState, TrDispatch };

export const allActions = {
  ...configActions,
  ...web3Actions,
  ...userActions
};

export const allSelectors = {
  ...configSelectors,
  ...web3Selectors,
  ...userSelectors
};

export * from "./slices/config";
export * from "./slices/web3";
export * from "./slices/user";

export const useTrDispatch = () => baseUseDispatch<TrDispatch>();
export const useTrSelector: TypedUseSelectorHook<TrState> = baseUseSelector;
