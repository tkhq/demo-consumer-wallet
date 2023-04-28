import { ethers } from "ethers";
import { StyleSheet, View } from "react-native";
import useSWR from "swr";
import { useTurnkeyWalletContext } from "../TurnkeyWalletContext";
import { ScrollContainer } from "../components/ScrollContainer";
import { LabeledRow } from "../components/design";

export function HomeScreen() {
  const { signer, network, privateKeyId } = useTurnkeyWalletContext();

  const addressQuery = useSWR("/address", () => signer.getAddress());
  const balanceQuery = useSWR("/balance", () => signer.getBalance());
  const transactionCountQuery = useSWR("/transaction-count", () =>
    signer.getTransactionCount()
  );

  return (
    <ScrollContainer
      onRefresh={async () => {
        await Promise.all([
          addressQuery.mutate(),
          balanceQuery.mutate(),
          transactionCountQuery.mutate(),
        ]);
      }}
    >
      <View style={styles.root}>
        <LabeledRow label="Turnkey Private Key ID" value={privateKeyId} />
        <LabeledRow label="Current network" value={network} />
        <LabeledRow label="Wallet address" value={addressQuery.data ?? "–"} />
        <LabeledRow
          label="Wallet balance"
          value={
            balanceQuery.data
              ? `${ethers.utils.formatEther(balanceQuery.data)} Ether`
              : "–"
          }
        />
        <LabeledRow
          label="Transaction count"
          value={
            transactionCountQuery.data
              ? String(transactionCountQuery.data)
              : "–"
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
