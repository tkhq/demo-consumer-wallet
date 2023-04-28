import { ethers } from "ethers";
import { StyleSheet, Text, View } from "react-native";
import useSWR from "swr";
import { connectedTurnkeySigner } from "../TurnkeyWallet";
import { ScrollContainer } from "../components/ScrollContainer";

export function HomeScreen() {
  const addressQuery = useSWR("/address", () =>
    connectedTurnkeySigner.getAddress()
  );
  const balanceQuery = useSWR("/balance", () =>
    connectedTurnkeySigner.getBalance()
  );

  return (
    <ScrollContainer
      onRefresh={async () => {
        await Promise.all([addressQuery.mutate(), balanceQuery.mutate()]);
      }}
    >
      <View style={styles.root}>
        <Text>Your address is: {addressQuery.data}</Text>
        <Text>
          Your balance is: {ethers.utils.formatEther(balanceQuery.data ?? 0)}{" "}
          Ether
        </Text>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
