import ExpoConstants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import * as React from "react";

export const KEY_LIST = [
  "TURNKEY_API_PUBLIC_KEY",
  "TURNKEY_API_PRIVATE_KEY",
  "TURNKEY_BASE_URL",
  "TURNKEY_ORGANIZATION_ID",
  "TURNKEY_PRIVATE_KEY_ID",
  "INFURA_API_KEY",
  "ETHERSCAN_API_KEY",
] as const;

type TCredentials = {
  TURNKEY_API_PUBLIC_KEY: string | null;
  TURNKEY_API_PRIVATE_KEY: string | null;
  TURNKEY_BASE_URL: string | null;
  TURNKEY_ORGANIZATION_ID: string | null;
  TURNKEY_PRIVATE_KEY_ID: string | null;
  INFURA_API_KEY: string | null;
  ETHERSCAN_API_KEY: string | null;
};

export const initialCredentialsState = {
  TURNKEY_API_PUBLIC_KEY: null,
  TURNKEY_API_PRIVATE_KEY: null,
  TURNKEY_BASE_URL: "https://coordinator-beta.turnkey.io",
  TURNKEY_ORGANIZATION_ID: null,
  TURNKEY_PRIVATE_KEY_ID: null,
  INFURA_API_KEY: null,
  ETHERSCAN_API_KEY: null,
};

type TCredentialsContextValue = {
  credentials: TCredentials;
  updateCredential: (
    key: (typeof KEY_LIST)[number],
    value: string
  ) => Promise<void>;
  hasAllCredentials: boolean;
  resetAll: () => Promise<void>;
} | null;

const CredentialsContext = React.createContext<TCredentialsContextValue>(null);

export function CredentialsContextProvider(props: {
  children: React.ReactNode;
}) {
  const [credentials, setCredentials] = React.useState<TCredentials>(
    initialCredentialsState
  );

  const hasInitialized = React.useRef<boolean>(false);

  React.useEffect(() => {
    if (hasInitialized.current) {
      return;
    }
    hasInitialized.current = true;

    Promise.all(
      KEY_LIST.map(async (key) => {
        return {
          key,
          storedValue: await SecureStore.getItemAsync(key),
        };
      })
    ).then((mapList) => {
      const result: TCredentials = { ...initialCredentialsState };

      for (const { key, storedValue } of mapList) {
        result[key] = storedValue;

        // Only use prefilled variables in dev builds
        if (__DEV__) {
          if (storedValue == null) {
            const maybePrefilledValue: string | undefined =
              ExpoConstants.manifest?.extra?.[key];

            if (
              maybePrefilledValue &&
              // Not a placeholder
              !maybePrefilledValue.startsWith("<")
            ) {
              result[key] = maybePrefilledValue ?? null;
            }
          }
        }

        // Sane defaults
        if (key === "TURNKEY_BASE_URL" && result[key] == null) {
          result[key] = initialCredentialsState[key];
        }
      }

      setCredentials(result);
    });
  }, []);

  const contextValue = React.useMemo(() => {
    return {
      credentials,
      updateCredential: async (
        key: (typeof KEY_LIST)[number],
        value: string | null
      ) => {
        if (value == null) {
          await SecureStore.deleteItemAsync(key);
        } else {
          await SecureStore.setItemAsync(key, value);
        }

        setCredentials((currentState) => ({
          ...currentState,
          [key]: value,
        }));
      },
      hasAllCredentials: Object.keys(credentials).every((key) =>
        // @ts-expect-error -- `Object.keys(...)` doesn't refine
        Boolean(credentials[key])
      ),
      resetAll: async () => {
        setCredentials(initialCredentialsState);

        await Promise.all(
          KEY_LIST.map(async (key) => {
            const maybeValue = initialCredentialsState[key];
            if (maybeValue != null) {
              await SecureStore.setItemAsync(key, maybeValue);
            } else {
              await SecureStore.deleteItemAsync(key);
            }
          })
        );
      },
    };
  }, [credentials]);

  return (
    <CredentialsContext.Provider value={contextValue}>
      {props.children}
    </CredentialsContext.Provider>
  );
}

export function useCredentialsContext(): NonNullable<TCredentialsContextValue> {
  const value = React.useContext(CredentialsContext);

  if (value == null) {
    throw new Error(
      `Context wasn't initialized. Did you forget to put a \`<CredentialsContextProvider>\` ancestor?`
    );
  }

  return value;
}
