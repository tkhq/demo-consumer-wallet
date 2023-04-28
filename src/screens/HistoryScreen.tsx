import { ethers } from "ethers";
import * as WebBrowser from "expo-web-browser";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useHistoryQuery } from "../TurnkeyQuery";
import { useTurnkeyWalletContext } from "../TurnkeyWalletContext";
import { LabeledRow } from "../components/Design";
import { ScrollContainer } from "../components/ScrollContainer";
import { getNetworkDisplayValue } from "../shared";

export function HistoryScreen() {
  const historyQuery = useHistoryQuery();
  const { network } = useTurnkeyWalletContext();

  let content: React.ReactNode;

  if (historyQuery.data?.transactionList == null) {
    content = (
      <View style={styles.emptyStateContainer}>
        <Text>Loading...</Text>
      </View>
    );
  } else if (historyQuery.data.transactionList.length === 0) {
    content = (
      <View style={styles.emptyStateContainer}>
        <Text>No transaction history</Text>
      </View>
    );
  } else {
    content = (
      <>
        {historyQuery.data?.transactionList?.map((item) => {
          const displayValue = [
            `${ethers.utils.formatEther(item.value)} ETH`,
            item.from !== historyQuery.data?.address
              ? `from ${truncateAddress(item.from)}`
              : item.to
              ? `to ${truncateAddress(item.to)}`
              : null,
          ]
            .filter(Boolean)
            .join(" ");

          const etherscanLink =
            network === "homestead"
              ? `https://etherscan.io/tx/${item.hash}`
              : `https://${network}.etherscan.io/tx/${item.hash}`;

          return (
            <LabeledRow
              key={item.hash}
              auxiliary={getNetworkDisplayValue(network)}
              label={
                item.timestamp != null
                  ? new Date(item.timestamp * 1000).toLocaleString()
                  : "–"
              }
              value={displayValue}
              onValuePress={() => {
                WebBrowser.openBrowserAsync(etherscanLink);
              }}
            />
          );
        })}
      </>
    );
  }

  return (
    <ScrollContainer
      onRefresh={async () => {
        await historyQuery.mutate();
      }}
    >
      <View style={styles.root}>{content}</View>
    </ScrollContainer>
  );
}

function truncateAddress(input: string): string {
  return input.slice(0, 6) + "..." + input.slice(-4);
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  emptyStateContainer: {
    display: "flex",
    marginVertical: 16,
    alignItems: "center",
  },
});
