import { Eip1193Bridge } from "@ethersproject/experimental";
import { TurnkeySigner } from "@turnkey/ethers";
import { ethers } from "ethers";
import * as React from "react";
import { assertNonEmptyString } from "../utils";
import { useCredentialsContext } from "./CredentialsContext";

// This is the list that Infura supports in Ethers v5
// https://github.com/ethers-io/ethers.js/blob/f97b92bbb1bde22fcc44100af78d7f31602863ab/packages/providers/src.ts/infura-provider.ts#L86
export const infuraNetworkList = [
  "homestead",
  "goerli",
  "sepolia",
  "matic",
  "maticmum",
  "optimism",
  "optimism-goerli",
  "arbitrum",
  "arbitrum-goerli",
] as const;

export type TInfuraNetwork = (typeof infuraNetworkList)[number];

type TTurnkeyWalletContextValue = {
  connectedSigner: TurnkeySigner | null;
  eip1193: Eip1193Bridge | null;
  network: TInfuraNetwork;
  setNetwork: (x: TInfuraNetwork) => void;
  error: Error | null;
} | null;

const TurnkeyWalletContext =
  React.createContext<TTurnkeyWalletContextValue>(null);

export function TurnkeyWalletContextProvider(props: {
  children: React.ReactNode;
}) {
  const [network, setNetwork] = React.useState<TInfuraNetwork>("homestead");
  const { credentials } = useCredentialsContext();
  const {
    TURNKEY_API_PUBLIC_KEY,
    TURNKEY_API_PRIVATE_KEY,
    TURNKEY_BASE_URL,
    TURNKEY_ORGANIZATION_ID,
    TURNKEY_PRIVATE_KEY_ID,
    INFURA_API_KEY,
  } = credentials;

  const contextValue = React.useMemo(() => {
    let connectedSigner: TurnkeySigner | null = null;
    let eip1193: Eip1193Bridge | null = null;
    let error: Error | null = null;

    try {
      assertNonEmptyString(TURNKEY_API_PUBLIC_KEY, "TURNKEY_API_PUBLIC_KEY");
      assertNonEmptyString(TURNKEY_API_PRIVATE_KEY, "TURNKEY_API_PRIVATE_KEY");
      assertNonEmptyString(TURNKEY_BASE_URL, "TURNKEY_BASE_URL");
      assertNonEmptyString(TURNKEY_ORGANIZATION_ID, "TURNKEY_ORGANIZATION_ID");
      assertNonEmptyString(TURNKEY_PRIVATE_KEY_ID, "TURNKEY_PRIVATE_KEY_ID");

      const signer = new TurnkeySigner({
        apiPublicKey: TURNKEY_API_PUBLIC_KEY,
        apiPrivateKey: TURNKEY_API_PRIVATE_KEY,
        baseUrl: TURNKEY_BASE_URL,
        organizationId: TURNKEY_ORGANIZATION_ID,
        privateKeyId: TURNKEY_PRIVATE_KEY_ID,
      });

      const provider = new ethers.providers.InfuraProvider(
        network,
        INFURA_API_KEY
      );

      connectedSigner = signer.connect(provider);
      eip1193 = new Eip1193Bridge(connectedSigner, provider);
    } catch (e) {
      error = e as Error;
    }

    return {
      connectedSigner,
      eip1193,
      network,
      setNetwork,
      error,
    };
  }, [
    INFURA_API_KEY,
    TURNKEY_API_PRIVATE_KEY,
    TURNKEY_API_PUBLIC_KEY,
    TURNKEY_BASE_URL,
    TURNKEY_ORGANIZATION_ID,
    TURNKEY_PRIVATE_KEY_ID,
    network,
  ]);

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
