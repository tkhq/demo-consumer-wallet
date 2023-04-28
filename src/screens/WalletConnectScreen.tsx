import WalletConnect from "@walletconnect/client";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useWalletQuery } from "../turnkey/TurnkeyQuery";
import { LabeledRow } from "../components/Design";
import { LogView, useLogViewData } from "../components/LogView";
import { usePrompt } from "../components/Prompt";
import { ScrollContainer } from "../components/ScrollContainer";
import type { TWalletConnectScreenProps } from "../navigation";

// See https://github.com/WalletConnect/walletconnect-monorepo/blob/c94c1d608e75ef7f0e77572a8627d9412ade24c3/packages/helpers/utils/src/constants.ts
const WALLETCONNECT_RESERVED_EVENTS = [
  "session_request",
  "session_update",
  "exchange_key",
  "connect",
  "disconnect",
  "display_uri",
  "modal_closed",
  "transport_open",
  "transport_close",
  "transport_error",
] as const;

const WALLETCONNECT_SIGNING_METHODS = [
  "eth_sendTransaction",
  "eth_signTransaction",
  "eth_sign",
  "eth_signTypedData",
  "eth_signTypedData_v1",
  "eth_signTypedData_v2",
  "eth_signTypedData_v3",
  "eth_signTypedData_v4",
  "personal_sign",
  "wallet_addEthereumChain",
  "wallet_switchEthereumChain",
  "wallet_getPermissions",
  "wallet_requestPermissions",
  "wallet_registerOnboarding",
  "wallet_watchAsset",
  "wallet_scanQRCode",
] as const;

const WALLETCONNECT_STATE_METHODS = [
  "eth_accounts",
  "eth_chainId",
  "net_version",
] as const;

export function WalletConnectScreen(props: TWalletConnectScreenProps) {
  const { uri } = props.route.params;

  const { logList } = useWalletConnectSubscription({ uri });

  return (
    <ScrollContainer>
      <View style={styles.root}>
        <LabeledRow label="Connecting to" value={uri} />
        <LogView logList={logList} />
      </View>
    </ScrollContainer>
  );
}

// Get a (QR) link from https://example.walletconnect.org/
//
// More references:
// - https://docs.walletconnect.com/1.0/quick-start/wallets/react-native
// - https://docs.walletconnect.com/client-api
// - https://github.com/WalletConnect/walletconnect-monorepo/tree/v1.0/packages/clients/
function useWalletConnectSubscription(input: { uri: string }) {
  const { uri } = input;
  const { showPrompt } = usePrompt();
  const walletQuery = useWalletQuery();

  const { logList, appendLog } = useLogViewData();

  const address = walletQuery.data?.address;
  const chainId = walletQuery.data?.chainId;
  const lastConnectedUri = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (address == null || chainId == null) {
      return;
    }
    if (lastConnectedUri.current === uri) {
      return;
    }

    lastConnectedUri.current = uri;

    try {
      appendLog({
        label: "WalletConnect",
        data: "Establishing connection",
      });

      const connector = new WalletConnect({
        uri,
      });

      [
        ...WALLETCONNECT_RESERVED_EVENTS,
        ...WALLETCONNECT_SIGNING_METHODS,
        ...WALLETCONNECT_STATE_METHODS,
      ]
        .filter((x) => x !== "session_request")
        .forEach((eventName) => {
          connector.on(eventName, async (error, payload) => {
            if (error != null) {
              appendLog({
                label: "`" + eventName + "`",
                data: `Error: ${error.message}`,
              });
            } else {
              appendLog({
                label: "`" + eventName + "`",
                data: payload,
              });
            }
          });
        });

      connector.on("session_request", async (error, payload) => {
        const label = "`session_request`";

        appendLog({
          label,
          data: "Handshaking",
        });

        if (error != null) {
          appendLog({
            label,
            data: `Error: ${error.message}`,
          });
        }

        const handshakeUserResponse = await showPrompt({
          title: "WalletConnect Session Request",
          message: `Do you want to connect to the WalletConnect session?`,
          actionList: [
            {
              id: "APPROVE",
              title: "Approve",
              type: "default",
            },
            {
              id: "REJECT",
              title: "Reject",
              type: "cancel",
            },
          ],
        });

        if (handshakeUserResponse.id === "APPROVE") {
          appendLog({
            label: "User input",
            data: "Connection approved",
          });

          connector.approveSession({
            chainId,
            accounts: [address],
          });
        } else if (handshakeUserResponse.id === "REJECT") {
          appendLog({
            label: "User input",
            data: "Connection rejected",
          });

          connector.rejectSession();
        }
      });
    } catch (error) {
      appendLog({
        label: "WalletConnect",
        data: `Error: ${(error as Error).message}`,
      });
    }
  }, [uri, showPrompt, address, chainId, appendLog]);

  return {
    logList,
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
