import { Config } from "./hooks/useConfig";
export {};

declare global {
  // this is the default export name of the [ConfigFile](full-stack-pattern.matthewkeil.com/docs/constructs/ConfigFile)
  export const CONFIG_FILE: Config;
}

/**
 *
 * Types for ethers.js and metamask
 *
 */
interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

declare global {
  export interface Window {
    ethereum: {
      isMetaMask: boolean;
      isStatus: boolean;
      host: string;
      path: string;
      sendAsync: (
        request: { method: string; params?: Array<any> },
        callback: (error: any, response: any) => void
      ) => void;
      send: (
        request: { method: string; params?: Array<any> },
        callback: (error: any, response: any) => void
      ) => void;
      request: (request: { method: string; params?: Array<any> }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

declare module "*.svg" {
  const content: any;
  export default content;
}

declare module "*.png" {
  const content: any;
  export default content;
}

declare module "*.jpg" {
  const content: any;
  export default content;
}

declare module "*.jpeg" {
  const content: any;
  export default content;
}

declare module "*.gif" {
  const content: any;
  export default content;
}
