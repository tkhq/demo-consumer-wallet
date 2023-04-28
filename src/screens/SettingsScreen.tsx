import { StyleSheet, Text, View } from "react-native";
import { ScrollContainer } from "../components/ScrollContainer";

export function SettingsScreen() {
  return (
    <ScrollContainer>
      <View style={styles.root}>
        <Text>👋 Settings screen</Text>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
