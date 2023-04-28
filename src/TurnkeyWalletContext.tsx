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

// This is the list that Alchemy supports in Ethers v5
type TNetwork =
  | "homestead"
  | "goerli"
  | "matic"
  | "maticmum"
  | "arbitrum"
  | "arbitrum-goerli"
  | "optimism"
  | "optimism-goerli";

type TTurnkeyWalletContextValue = {
  signer: TurnkeySigner;
  network: TNetwork;
  setNetwork: (x: TNetwork) => void;
  privateKeyId: string;
  setPrivateKeyId: (x: string) => void;
};

const TurnkeyWalletContext = React.createContext<TTurnkeyWalletContextValue>({
  // @ts-expect-error -- not possible in practice
  signer: null,
});

export function TurnkeyWalletContextProvider(props: {
  children: React.ReactNode;
}) {
  const [privateKeyId, setPrivateKeyId] = React.useState(
    TURNKEY_PRIVATE_KEY_ID
  );
  const [network, setNetwork] = React.useState<TNetwork>("goerli");

  const contextValue = React.useMemo(
    () => ({
      signer: new TurnkeySigner(
        {
          apiPublicKey: TURNKEY_API_PUBLIC_KEY,
          apiPrivateKey: TURNKEY_API_PRIVATE_KEY,
          baseUrl: TURNKEY_BASE_URL,
          organizationId: TURNKEY_ORGANIZATION_ID,
          privateKeyId,
        },
        new ethers.providers.AlchemyProvider(network, ALCHEMY_API_KEY)
      ),
      network,
      setNetwork,
      privateKeyId,
      setPrivateKeyId,
    }),
    [privateKeyId, network]
  );

  return (
    <TurnkeyWalletContext.Provider value={contextValue}>
      {props.children}
    </TurnkeyWalletContext.Provider>
  );
}

export function useTurnkeyWalletContext(): TTurnkeyWalletContextValue {
  return React.useContext(TurnkeyWalletContext);
}
