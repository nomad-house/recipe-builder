import { providers, getDefaultProvider } from "ethers";

const networks = ["mainnet", "ropsten", "rinkeby", "kovan", "goerli"] as const;
type Network = typeof networks[number];

// provider should be a singleton for all contracts
let provider: Promise<providers.BaseProvider> | undefined;

export class ContractService {
  public provider: Promise<providers.BaseProvider>;
  public isMetaMask = false;

  constructor({
    url,
    network,
    timeoutInMs = 3000,
  }: {
    url?: string;
    network?: Network;
    timeoutInMs?: number;
  }) {
    // check for singleton provider created by another contract and use it
    if (provider) {
      this.provider = provider;
      return;
    }

    if (window) {
      if (window.ethereum) {
        if (window.ethereum.isMetaMask) {
          this.isMetaMask = true;
        }
        provider = this.provider = Promise.resolve(
          new providers.Web3Provider(window.ethereum)
        );
      } else {
        provider = this.provider = new Promise((resolve, reject) => {
          const eventHandler = () => {
            window.removeEventListener("ethereum#initialized", eventHandler);
            resolve(new providers.Web3Provider(window.ethereum));
          };
          window.addEventListener("ethereum#initialized", eventHandler, {
            once: true,
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

    if (url) {
      if (!(url.startsWith("http") || url.startsWith("ws"))) {
        throw new Error("Invalid url");
      }
      provider = this.provider = url.startsWith("http")
        ? Promise.resolve(new providers.JsonRpcProvider(url))
        : Promise.resolve(new providers.WebSocketProvider(url));
    }

    let _network = network;
    if (!_network) {
      _network = "mainnet";
    }

    if (_network === "mainnet") {
      console.warn("CAUTION: using mainnet");
    }

    const providerConfig: any = {};
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
            projectSecret: process.env.INFURA_PROJECT_SECRET,
          };
    }
    if (process.env.POCKET_APPLICATION_ID) {
      providerConfig.pocket = !process.env.POCKET_APPLICATION_SECRET
        ? process.env.POCKET_APPLICATION_ID
        : {
            projectId: process.env.POCKET_APPLICATION_ID,
            projectSecret: process.env.POCKET_APPLICATION_SECRET,
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
      getDefaultProvider(_network, providerConfig)
    );
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
