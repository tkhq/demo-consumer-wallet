import * as React from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { RootSiblingParent } from "react-native-root-siblings";

export function ScrollContainer(props: {
  children: React.ReactNode;
  onRefresh?: () => Promise<void>;
}) {
  const { children, onRefresh = null } = props;

  const [isRefreshing, setIsRefreshing] = React.useState(false);

  return (
    <RootSiblingParent>
      <View style={styles.root}>
        <ScrollView
          style={styles.scrollView}
          contentInsetAdjustmentBehavior="automatic"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
          refreshControl={
            onRefresh != null ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={async () => {
                  setIsRefreshing(true);
                  await onRefresh();
                  setIsRefreshing(false);
                }}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
});
