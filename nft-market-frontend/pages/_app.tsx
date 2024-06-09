import type { AppProps } from "next/app";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, configureChains, WagmiConfig } from "wagmi";
import { mainnet, sepolia, polygonMumbai, polygon, goerli } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import "@rainbow-me/rainbowkit/styles.css";
import "../styles/globals.css";
import { infuraProvider } from "@wagmi/core/providers/infura";
import Header from "@/components/Header";
import Head from "next/head";
//@ts-ignore
import { NotificationProvider } from "@web3uikit/core";

const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY!;
const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, sepolia, polygonMumbai, polygon, goerli],
  [publicProvider()]
  // [infuraProvider({ apiKey: infuraApiKey })]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: walletConnectProjectId,
  chains,
});

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Head>
        <title>NFT Market</title>
        <meta name="description" content="NFT Market"></meta>
        <link rel="icon" href="./favicon.ico"></link>
      </Head>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <NotificationProvider>
            <Header></Header>;
            <Component {...pageProps} />{" "}
          </NotificationProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}
