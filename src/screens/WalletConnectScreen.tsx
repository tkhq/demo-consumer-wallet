import WalletConnect from "@walletconnect/client";
import * as React from "react";
import { StyleSheet, View } from "react-native";
import { usePrompt } from "../components/Prompt";
import { ScrollContainer } from "../components/ScrollContainer";
import { LabeledRow } from "../components/design";
import type { TWalletConnectScreenProps } from "../navigation";

// Get a (QR) link from https://example.walletconnect.org/
//
// More references:
// - https://docs.walletconnect.com/1.0/quick-start/wallets/react-native
// - https://docs.walletconnect.com/client-api
// - https://github.com/WalletConnect/walletconnect-monorepo/tree/v1.0/packages/clients/
export function WalletConnectScreen(props: TWalletConnectScreenProps) {
  const { uri } = props.route.params;
  const [connectionState, setConnectionState] = React.useState(
    "Establishing session"
  );

  const { showPrompt } = usePrompt();

  let connector: WalletConnect | null = null;
  let errorMessage: string | null = null;
  try {
    connector = new WalletConnect({
      uri,
    });

    connector.on("session_request", async (error, payload) => {
      setConnectionState("Handshaking");

      const userResponse = await showPrompt({
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
    });
  } catch (error) {
    errorMessage = (error as Error).message;
  }

  return (
    <ScrollContainer>
      <View style={styles.root}>
        <LabeledRow label="Connecting to" value={uri} />
        <LabeledRow
          label="Connection state"
          value={
            errorMessage != null ? `Error: ${errorMessage}` : connectionState
          }
        />
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
