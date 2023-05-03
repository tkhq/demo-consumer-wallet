import * as React from "react";
import { Button, Keyboard, StyleSheet, View } from "react-native";
import { useTypedNavigation } from "../navigation";
import { useWalletConnectContext } from "../walletconnect/WalletConnectContext";
import { LabeledTextInput } from "./Design";

export function WalletConnectInputView() {
  const { uri, setUri } = useWalletConnectContext();
  const navigation = useTypedNavigation();

  const stringUri = uri ?? "";

  const isInputInvalid = !stringUri.startsWith("wc:");

  const doNavigate = () => {
    if (isInputInvalid) {
      return;
    }

    navigation.navigate("walletconnect", {
      uri: stringUri,
    });
  };

  return (
    <>
      <LabeledTextInput
        value={stringUri}
        label="WalletConnect link"
        auxiliary="Scan QR code or paste link"
        onChangeText={setUri}
        placeholder="wc:..."
        onSubmitEditing={doNavigate}
      />
      <View style={styles.connectButtonWrapper}>
        <Button
          title="Scan QR code"
          onPress={() => {
            navigation.navigate("scanner");
          }}
        />
        <Button
          title="Connect"
          disabled={isInputInvalid}
          onPress={() => {
            Keyboard.dismiss();

            doNavigate();
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
