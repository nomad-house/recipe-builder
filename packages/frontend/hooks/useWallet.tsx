import { providers as PROVIDERS } from "ethers";
import { createContext, Reducer, useReducer, useEffect, useRef, useState, useContext } from "react";

interface WalletContext {
  account?: string;
  chain?: string;
  provider?: React.MutableRefObject<PROVIDERS.Web3Provider | undefined>;
  getAccount: (askPermission?: boolean) => void;
}

const Context = createContext<WalletContext | undefined>(undefined);

function getChainName(chainId: string) {
  if (typeof parseInt(chainId) === "number" && chainId.length > 2) {
    return "local";
  }
  switch (chainId) {
    case "1":
      return "mainnet";
    case "3":
      return "ropsten";
    case "4":
      return "rinkeby";
    case "5":
      return "goerli";
    case "42":
      return "kovan";
    default:
      return `unknown chainId: ${chainId}`;
  }
}

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [account, setAccount] = useState<string | undefined>("no wallet connected");
  const [chain, setChain] = useState<string | undefined>(undefined);
  const provider = useRef<PROVIDERS.Web3Provider | undefined>(undefined);

  function handleAccountChange(accounts: (string | undefined)[]) {
    setAccount(accounts[0]);
  }

  function handleChainChange() {
    console.log("Chain changed");
    window.location.reload();
  }

  function getChain() {
    window.ethereum.request({ method: "eth_chainId" }).then((chainId) => {
      setChain(getChainName(chainId));
    });
  }

  function getAccount(askPermission?: boolean) {
    if (!("window" in globalThis) || !window.ethereum) {
      return;
    }

    window.ethereum
      .request({ method: askPermission ? "eth_requestAccounts" : "eth_accounts" })
      .then((accounts) => {
        handleAccountChange(accounts);
        if (!chain) {
          getChain();
        }
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log("User rejected connection to MetaMask.");
        } else {
          console.error(err);
        }
      });
  }

  useEffect(() => {
    if (!("window" in globalThis) || !window.ethereum) {
      return;
    }

    window.ethereum.on("chainChanged", handleChainChange);
    window.ethereum.on("accountsChanged", handleAccountChange);

    provider.current = new PROVIDERS.Web3Provider(window.ethereum);

    return () => {
      window.ethereum.removeListener("chainChanged", handleChainChange);
      window.ethereum.removeListener("accountsChanged", handleAccountChange);
    };
  }, []);

  return (
    <Context.Provider
      value={{
        account,
        chain,
        provider,
        getAccount
      }}
    >
      {children}
    </Context.Provider>
  );
};

export function useWallet(askPermission?: boolean) {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  const { account, chain, provider, getAccount } = context;
  getAccount(askPermission);

  return { account, chain, provider };
}
