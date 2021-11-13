import "../styles/globals.scss";
import type { AppProps } from "next/app";
import { WalletProvider } from "../hooks/useWallet";

function CODEified({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}

export default CODEified;
