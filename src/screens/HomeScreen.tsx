import { useActionSheet } from "@expo/react-native-action-sheet";
import { ethers } from "ethers";
import { StyleSheet, View } from "react-native";
import useSWR from "swr";
import {
  alchemyNetworkList,
  useTurnkeyWalletContext,
  type TAlchemyNetwork,
} from "../TurnkeyWalletContext";
import { ScrollContainer } from "../components/ScrollContainer";
import { LabeledRow } from "../components/design";

function useWalletQuery() {
  const { signer, network, privateKeyId } = useTurnkeyWalletContext();

  return useSWR(`${network}/${privateKeyId}`, async () => {
    return {
      address: await signer.getAddress(),
      balance: await signer.getBalance(),
      transactionCount: await signer.getTransactionCount(),
    };
  });
}

export function HomeScreen() {
  const { privateKeyId } = useTurnkeyWalletContext();

  const walletQuery = useWalletQuery();

  return (
    <ScrollContainer
      onRefresh={async () => {
        await walletQuery.mutate();
      }}
    >
      <View style={styles.root}>
        <LabeledRow label="Turnkey Private Key ID" value={privateKeyId} />
        <NetworkRow />
        <LabeledRow
          label="Wallet address"
          value={walletQuery.data?.address ?? "–"}
        />
        <LabeledRow
          label="Wallet balance"
          value={
            walletQuery.data?.balance != null
              ? `${ethers.utils.formatEther(walletQuery.data?.balance)} Ether`
              : "–"
          }
        />
        <LabeledRow
          label="Transaction count"
          value={
            walletQuery.data?.transactionCount != null
              ? String(walletQuery.data?.transactionCount)
              : "–"
          }
        />
      </View>
    </ScrollContainer>
  );
}

function getNetworkDisplayValue(network: TAlchemyNetwork): string {
  return network === "homestead" ? "mainnet" : network;
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
});
