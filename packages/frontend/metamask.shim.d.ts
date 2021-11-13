export {};

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface Metamask extends EventEm {}

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
