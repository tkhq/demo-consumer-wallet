import WalletConnect from "@walletconnect/client";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { useWalletQuery } from "../TurnkeyQuery";
import { LabeledRow } from "../components/Design";
import { LogView, useLogViewData } from "../components/LogView";
import { usePrompt } from "../components/Prompt";
import { ScrollContainer } from "../components/ScrollContainer";
import type { TWalletConnectScreenProps } from "../navigation";

// Get a (QR) link from https://example.walletconnect.org/
//
// More references:
// - https://docs.walletconnect.com/1.0/quick-start/wallets/react-native
// - https://docs.walletconnect.com/client-api
// - https://github.com/WalletConnect/walletconnect-monorepo/tree/v1.0/packages/clients/
export function WalletConnectScreen(props: TWalletConnectScreenProps) {
  const { uri } = props.route.params;
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
        label: "Connection state",
        data: "Initial request",
      });

      const connector = new WalletConnect({
        uri,
      });

      connector.on("session_request", async (error, payload) => {
        appendLog({
          label: "Connection state",
          data: "Handshaking",
        });

        if (error != null) {
          appendLog({
            label: "Connection state",
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
        label: "Connection state",
        data: `Error: ${(error as Error).message}`,
      });
    }
  }, [uri, showPrompt, address, chainId, appendLog]);

  return (
    <ScrollContainer>
      <View style={styles.root}>
        <LabeledRow label="Connecting to" value={uri} />
        <LogView logList={logList} />
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
