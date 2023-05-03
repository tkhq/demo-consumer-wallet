import { useActionSheet } from "@expo/react-native-action-sheet";
import { ethers } from "ethers";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { Button, StyleSheet, View } from "react-native";
import { LabeledRow } from "../components/Design";
import { ScrollContainer } from "../components/ScrollContainer";
import { WalletConnectInputView } from "../components/WalletConnectInputView";
import { useTypedNavigation } from "../navigation";
import { useCredentialsContext } from "../turnkey/CredentialsContext";
import { useWalletQuery } from "../turnkey/TurnkeyQuery";
import {
  alchemyNetworkList,
  useTurnkeyWalletContext,
} from "../turnkey/TurnkeyWalletContext";
import { getEtherscanUrl, getNetworkDisplayValue } from "../utils";

export function HomeScreen() {
  const { network, error } = useTurnkeyWalletContext();
  const { credentials, hasAllCredentials } = useCredentialsContext();

  const walletQuery = useWalletQuery();

  const address = walletQuery.data?.address;
  const balance = walletQuery.data?.balance;
  const transactionCount = walletQuery.data?.transactionCount;

  let content: React.ReactNode;

  if (!hasAllCredentials) {
    content = (
      <>
        <LabeledRow
          label="Welcome!"
          value="Please fill in your Turnkey credentials"
        />
        <SettingsLink />
      </>
    );
  } else if (error != null) {
    content = (
      <>
        <LabeledRow label="Error" value={error.message} />
        <SettingsLink />
      </>
    );
  } else {
    content = (
      <>
        <LabeledRow
          label="Turnkey private key ID"
          value={credentials.TURNKEY_PRIVATE_KEY_ID || "<unknown>"}
        />
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
        <WalletConnectInputView />
      </>
    );
  }

  return (
    <ScrollContainer
      onRefresh={async () => {
        await walletQuery.mutate(undefined);
      }}
    >
      <View style={styles.root}>{content}</View>
    </ScrollContainer>
  );
}

function SettingsLink() {
  const navigation = useTypedNavigation();

  return (
    <View style={styles.buttonGroup}>
      <Button
        title="Update credentials"
        onPress={() => {
          navigation.navigate("settings");
        }}
      />
    </View>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  buttonGroup: {
    padding: 4,
  },
});
