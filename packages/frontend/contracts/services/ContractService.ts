import { providers, getDefaultProvider } from "ethers";

const networks = ["mainnet", "ropsten", "rinkeby", "kovan", "goerli"] as const;
type Network = typeof networks[number];

// provider should be a singleton for all contracts
let provider: Promise<providers.JsonRpcProvider> | undefined;

const unsupportedProviders = [providers.EtherscanProvider, providers.FallbackProvider];

export interface ContractServiceProps {
  /**
   * @description used for server side connections to blockchain nodes. generally for
   * local development but in instances where you host your own node this is where you
   * can set the service to look to that url.
   */
  url?: string;
  /**
   * @description used for server side connections. see @ethersproject/providers
   * for more details on what values are valid.
   */
  network?: Network;
  /**
   * @description sets timeout to wait for client side provider to be injected onto
   * the window object. Example is react native, where the provider is asynchronously
   * injected.
   */
  timeoutInMs?: number;
}

type Provider = providers.JsonRpcProvider | providers.Web3Provider | providers.WebSocketProvider;
export class ContractService {
  protected provider: Promise<Provider>;
  protected isMetaMask = false;

  constructor({ url, network, timeoutInMs = 3000 }: ContractServiceProps) {
    // check for singleton provider created by another contract and use it
    if (provider) {
      this.provider = provider;
      return;
    }

    /**
     * if in browser look for metamask or other provider on window.ethereum
     */
    if (window) {
      if (window.ethereum) {
        if (window.ethereum.isMetaMask) {
          this.isMetaMask = true;
        }
        provider = this.provider = Promise.resolve(new providers.Web3Provider(window.ethereum));
      } else {
        provider = this.provider = new Promise((resolve, reject) => {
          const eventHandler = () => {
            window.removeEventListener("ethereum#initialized", eventHandler);
            resolve(new providers.Web3Provider(window.ethereum));
          };
          window.addEventListener("ethereum#initialized", eventHandler, {
            once: true
          });

          setTimeout(() => {
            if (!this.provider) {
              reject(new Error("No provider found"));
            }
          }, timeoutInMs);
        });
      }
      return;
    }

    /**
     * when running on node and a url is provided, either for local development
     * or for when one host their own node, attempt to connect to url that is provided
     */
    if (url) {
      if (!(url.startsWith("http") || url.startsWith("ws"))) {
        throw new Error("Invalid url");
      }
      provider = this.provider = url.startsWith("http")
        ? Promise.resolve(new providers.JsonRpcProvider(url))
        : Promise.resolve(new providers.WebSocketProvider(url));
      return;
    }

    /**
     * if not running in the browser and no url is provided use ethers default provider
     */
    let _network = network;

    // if no network is selected default to ropsten. must explicitly pass `mainnet` for prod
    if (!_network) {
      _network = "ropsten";
    }

    if (_network === "mainnet") {
      console.warn("CAUTION: using mainnet");
    }

    // ethers does not strongly type this object, allow any here
    const providerConfig: any = {}; // eslint-disable-line @typescript-eslint/no-explicit-any
    if (process.env.ETHERSCAN_API_TOKEN) {
      providerConfig.etherscan = process.env.ETHERSCAN_API_TOKEN;
    }
    if (process.env.ALCHEMY_API_TOKEN) {
      providerConfig.alchemy = process.env.ALCHEMY_API_TOKEN;
    }
    if (process.env.INFURA_PROJECT_ID) {
      providerConfig.infura = !process.env.INFURA_PROJECT_SECRET
        ? process.env.INFURA_PROJECT_ID
        : {
            projectId: process.env.INFURA_PROJECT_ID,
            projectSecret: process.env.INFURA_PROJECT_SECRET
          };
    }
    if (process.env.POCKET_APPLICATION_ID) {
      providerConfig.pocket = !process.env.POCKET_APPLICATION_SECRET
        ? process.env.POCKET_APPLICATION_ID
        : {
            projectId: process.env.POCKET_APPLICATION_ID,
            projectSecret: process.env.POCKET_APPLICATION_SECRET
          };
    }

    if (_network === "mainnet") {
      const numProviders = Object.keys(providerConfig).length;
      if (numProviders > 1) {
        providerConfig.quorum = 2;
      }
      if (numProviders === 4) {
        providerConfig.quorum = 3;
      }
    }

    provider = this.provider = Promise.resolve(
      getDefaultProvider(_network, providerConfig) as Provider
    );
  }

  protected async getSigner() {
    const provider = await this.provider;
    for (const unsupported of unsupportedProviders) {
      if (provider instanceof unsupported) {
        throw new Error("Unsupported provider");
      }
    }
    return provider.getSigner();
  }

  //   public async requestAccount() {
  //     const provider = await this.provider;
  //     if (window?.ethereum.request) {
  //       window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       });
  //     }
  //     const account = provider;
  //   }
}
