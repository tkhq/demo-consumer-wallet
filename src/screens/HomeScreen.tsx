import { useActionSheet } from "@expo/react-native-action-sheet";
import { ethers } from "ethers";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Button, Keyboard, StyleSheet, View } from "react-native";
import { LabeledRow, LabeledTextInput } from "../components/Design";
import { ScrollContainer } from "../components/ScrollContainer";
import { useTypedNavigation } from "../navigation";
import { useWalletQuery } from "../turnkey/TurnkeyQuery";
import {
  alchemyNetworkList,
  useTurnkeyWalletContext,
} from "../turnkey/TurnkeyWalletContext";
import { getEtherscanUrl, getNetworkDisplayValue } from "../utils";

export function HomeScreen() {
  const { privateKeyId, network } = useTurnkeyWalletContext();

  const walletQuery = useWalletQuery();

  const address = walletQuery.data?.address;
  const balance = walletQuery.data?.balance;
  const transactionCount = walletQuery.data?.transactionCount;

  return (
    <ScrollContainer
      onRefresh={async () => {
        await walletQuery.mutate(undefined);
      }}
    >
      <View style={styles.root}>
        <LabeledRow label="Turnkey Private Key ID" value={privateKeyId} />
        <NetworkRow />
        <LabeledRow
          label="Wallet address"
          auxiliary={address == null ? undefined : "Etherscan ↗"}
          value={address ?? "–"}
          onValuePress={
            address == null
              ? undefined
              : async () => {
                  await WebBrowser.openBrowserAsync(
                    getEtherscanUrl(`/address/${address}`, network)
                  );
                }
          }
        />
        <LabeledRow
          label="Wallet balance"
          value={
            balance != null ? `${ethers.utils.formatEther(balance)} ETH` : "–"
          }
        />
        <LabeledRow
          label="Transaction count"
          value={transactionCount != null ? String(transactionCount) : "–"}
        />
        <WalletConnectView />
      </View>
    </ScrollContainer>
  );
}

function NetworkRow() {
  const { showActionSheetWithOptions } = useActionSheet();
  const { network: currentNetwork, setNetwork } = useTurnkeyWalletContext();

  return (
    <LabeledRow
      auxiliary="Tap to change"
      label="Current network"
      value={getNetworkDisplayValue(currentNetwork)}
      onValuePress={() => {
        const displayList = alchemyNetworkList.map(getNetworkDisplayValue);

        const options = [...displayList, "Cancel"];
        const cancelButtonIndex = options.length - 1;

        showActionSheetWithOptions(
          {
            options: options,
            cancelButtonIndex,
          },
          (selectedIndex) => {
            if (selectedIndex == null || selectedIndex === cancelButtonIndex) {
              return;
            }

            const selectedNetwork = alchemyNetworkList[selectedIndex];
            if (
              !alchemyNetworkList.includes(selectedNetwork) ||
              selectedNetwork === currentNetwork
            ) {
              return;
            }

            setNetwork(selectedNetwork);
          }
        );
      }}
    />
  );
}

function WalletConnectView() {
  const [uri, setUri] = React.useState<string>("");
  const navigation = useTypedNavigation();

  return (
    <>
      <LabeledTextInput
        value={uri}
        label="WalletConnect link"
        auxiliary="Copy from QR code"
        onChangeText={setUri}
        placeholder="Paste link here (starts with wc:...)"
      />
      <View style={styles.connectButtonWrapper}>
        <Button
          title="Connect"
          disabled={!uri.startsWith("wc:")}
          onPress={() => {
            Keyboard.dismiss();

            navigation.navigate("walletconnect", {
              uri,
            });
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  connectButtonWrapper: {
    padding: 4,
  },
});
