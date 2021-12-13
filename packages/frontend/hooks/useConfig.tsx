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
    console.error("global.CONFIG_FILE not found, using default config");
    config = {
      appUrl: "http://localhost:3000",
      apiUrl: "http://localhost:3001",
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
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return config;
}
