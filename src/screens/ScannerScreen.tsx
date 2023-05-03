import { BarCodeScanner } from "expo-barcode-scanner";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollContainer } from "../components/ScrollContainer";
import { useTypedNavigation } from "../navigation";
import { useWalletConnectContext } from "../walletconnect/WalletConnectContext";

const BARCODE_TYPE_QR = BarCodeScanner.Constants.BarCodeType.qr;

export function ScannerScreen() {
  const { setUri } = useWalletConnectContext();
  const navigation = useTypedNavigation();

  const [permissionResponse] = BarCodeScanner.usePermissions({
    request: true,
    get: true,
  });

  // Assumes the screen always gets popped (unmounted) after a successful scan
  const hasAlreadyReportedScanningResult = React.useRef<boolean>(false);

  let content: React.ReactNode;

  if (permissionResponse == null) {
    content = null; // Loading
  } else if (!permissionResponse.granted) {
    content = (
      <View style={styles.emptyStateContainer}>
        <Text>
          Camera access was denied; please grant permission in phone settings.
        </Text>
      </View>
    );
  } else {
    content = (
      <BarCodeScanner
        barCodeTypes={[BARCODE_TYPE_QR]}
        onBarCodeScanned={(event) => {
          if (hasAlreadyReportedScanningResult.current) {
            return;
          }

          const { type, data } = event;
          const maybeUri = data.trim();

          if (type !== BARCODE_TYPE_QR) {
            return;
          }

          if (!maybeUri.startsWith("wc:")) {
            return;
          }

          hasAlreadyReportedScanningResult.current = true;

          setUri(maybeUri);
          navigation.pop();
        }}
        style={[styles.scannerView]}
      />
    );
  }

  return (
    <ScrollContainer>
      <View style={styles.root}>{content}</View>
    </ScrollContainer>
  );
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
  scannerView: {
    marginVertical: 16,
    width: "100%",
    aspectRatio: 9 / 16, // Seems legit?
  },
});
