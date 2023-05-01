import { Eip1193Bridge } from "@ethersproject/experimental";
import { TurnkeySigner } from "@turnkey/ethers";
import { ethers } from "ethers";
import ExpoConstants from "expo-constants";
import * as React from "react";

const TURNKEY_API_PUBLIC_KEY =
  ExpoConstants.manifest?.extra?.TURNKEY_API_PUBLIC_KEY;
const TURNKEY_API_PRIVATE_KEY =
  ExpoConstants.manifest?.extra?.TURNKEY_API_PRIVATE_KEY;
const TURNKEY_BASE_URL = ExpoConstants.manifest?.extra?.TURNKEY_BASE_URL;
const TURNKEY_ORGANIZATION_ID =
  ExpoConstants.manifest?.extra?.TURNKEY_ORGANIZATION_ID;
const TURNKEY_PRIVATE_KEY_ID =
  ExpoConstants.manifest?.extra?.TURNKEY_PRIVATE_KEY_ID;
const ALCHEMY_API_KEY = ExpoConstants.manifest?.extra?.ALCHEMY_API_KEY;

export const ETHERSCAN_API_KEY =
  ExpoConstants.manifest?.extra?.ETHERSCAN_API_KEY;

// This is the list that Alchemy supports in Ethers v5
export const alchemyNetworkList = [
  "homestead",
  "goerli",
  "matic",
  "maticmum",
  "arbitrum",
  "arbitrum-goerli",
  "optimism",
  "optimism-goerli",
] as const;

export type TAlchemyNetwork = (typeof alchemyNetworkList)[number];

type TTurnkeyWalletContextValue = {
  connectedSigner: TurnkeySigner;
  eip1193: Eip1193Bridge;
  network: TAlchemyNetwork;
  setNetwork: (x: TAlchemyNetwork) => void;
  privateKeyId: string;
  setPrivateKeyId: (x: string) => void;
} | null;

const TurnkeyWalletContext =
  React.createContext<TTurnkeyWalletContextValue>(null);

export function TurnkeyWalletContextProvider(props: {
  children: React.ReactNode;
}) {
  const [privateKeyId, setPrivateKeyId] = React.useState(
    TURNKEY_PRIVATE_KEY_ID
  );
  const [network, setNetwork] = React.useState<TAlchemyNetwork>("goerli");

  const contextValue = React.useMemo(() => {
    const signer = new TurnkeySigner({
      apiPublicKey: TURNKEY_API_PUBLIC_KEY,
      apiPrivateKey: TURNKEY_API_PRIVATE_KEY,
      baseUrl: TURNKEY_BASE_URL,
      organizationId: TURNKEY_ORGANIZATION_ID,
      privateKeyId,
    });

    const provider = new ethers.providers.AlchemyProvider(
      network,
      ALCHEMY_API_KEY
    );

    const connectedSigner = signer.connect(provider);

    const eip1193 = new Eip1193Bridge(connectedSigner, provider);

    return {
      connectedSigner,
      eip1193,
      network,
      setNetwork,
      privateKeyId,
      setPrivateKeyId,
    };
  }, [privateKeyId, network]);

  return (
    <TurnkeyWalletContext.Provider value={contextValue}>
      {props.children}
    </TurnkeyWalletContext.Provider>
  );
}

export function useTurnkeyWalletContext(): NonNullable<TTurnkeyWalletContextValue> {
  const value = React.useContext(TurnkeyWalletContext);

  if (value == null) {
    throw new Error(
      `Context wasn't initialized. Did you forget to put a \`<TurnkeyWalletContextProvider>\` ancestor?`
    );
  }

  return value;
}
