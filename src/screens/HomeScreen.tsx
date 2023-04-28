import { StyleSheet, Text, View } from "react-native";
import { ScrollContainer } from "../components/ScrollContainer";

export function HomeScreen() {
  return (
    <ScrollContainer withRefreshControl={true}>
      <View style={styles.root}>
        <Text>👋 Home screen</Text>
      </View>
    </ScrollContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
