import { createContext, ReactNode, useContext } from "react";
import Head from "next/head";

const CONFIG_FILE_NAME = "config.js";

export interface Config {
  appUrl: string;
  apiUrl: string;
  authUrl: string;
  userPoolId: string;
  userPoolClientId: string;
}

const ConfigContext = createContext<Config | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  let config: Config;
  try {
    config = CONFIG_FILE;
  } catch {
    console.error("no CONFIG_FILE found");
    config = {
      appUrl: "",
      apiUrl: "",
      authUrl: "",
      userPoolId: "",
      userPoolClientId: ""
    };
  }
  return (
    <>
      <Head>
        <script async type="text/javascript" src={`/${CONFIG_FILE_NAME}`}></script>
      </Head>
      <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
    </>
  );
};

export function useConfig() {
  const config = useContext(ConfigContext);
  if (!config) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return config;
}
