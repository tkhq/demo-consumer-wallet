import * as React from "react";

type TWalletConnectContextValue = {
  uri: string | null;
  setUri: (value: string | null) => void;
} | null;

const WalletConnectContext =
  React.createContext<TWalletConnectContextValue>(null);

export function WalletConnectContextProvider(props: {
  children: React.ReactNode;
}) {
  const [uri, setUri] = React.useState<string | null>(null);

  const contextValue = React.useMemo(() => {
    return {
      uri,
      setUri,
    };
  }, [uri]);

  return (
    <WalletConnectContext.Provider value={contextValue}>
      {props.children}
    </WalletConnectContext.Provider>
  );
}

export function useWalletConnectContext(): NonNullable<TWalletConnectContextValue> {
  const value = React.useContext(WalletConnectContext);

  if (value == null) {
    throw new Error(
      `Context wasn't initialized. Did you forget to put a \`<WalletConnectContextProvider>\` ancestor?`
    );
  }

  return value;
}
